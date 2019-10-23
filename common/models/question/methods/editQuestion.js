/* global __ */
import _ from 'lodash';
import async from 'async';
import Joi from 'joi';
import {MAX_BODY_LENGTH, MIN_BODY_LENGTH, TITLE_MAX_LENGTH, TITLE_MIN_LENGTH} from '../../../../configs/constants/serverConstant';
import {permissionErrorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../utils/helper';

export default (Question) => {
    Question.editQuestion = (loggedInUser, formData, callback) => {
        const validateFormData = (next) => {
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                tagIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
                title: Joi.string().trim().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH).optional(),
                body: Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).optional(),
                isPublic: Joi.boolean().optional()
            });

            schema.validate(formData, {allowUnknown: false, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                if (Object.keys(value).length === 1) {
                    return next(validationErrorHandler(__('err.invalidRequest')));
                }
                formData = value;
                next();
            });
        };

        const prepareData = (next) => {
            async.parallel({
                'question': (cb) => {
                    Question.findById(id, (err, question) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!question) {
                            return cb(new Error(__('err.question.notExits')));
                        }
                        if (!isActiveQuestion(question)) {
                            return cb(new Error(__('err.question.notActive')));
                        }
                        if (question.ownerId.toString() !== loggedInUser.id.toString()) {
                            return cb(permissionErrorHandler());
                        }
                        cb(null, question);
                    });
                },
                'tags': (cb) => {
                    if (!formData.tagIds) {
                        return cb(null, null);
                    }
                    if (formData.tagIds.length === 0) {
                        return cb(null, []);
                    }
                    Question.app.models.SubCategory.find({
                        where: {
                            id: {
                                inq: formData.tagIds
                            }
                        }
                    }, (err, tags) => {
                        if (err) {
                            return cb(err);
                        }
                        if (tags.length !== formData.tagIds.length) {
                            return cb(new Error(__('err.subCategory.notExists')));
                        }
                        cb(null, tags);
                    });
                }
            }, (err, payload) => {
                if (err) {
                    return next(err);
                }
                next(null, payload);
            });
        };

        const updateQuestion = (payload, next) => {
            const {question, tags} = payload;
            const data = {};
            let removeTags = [];
            let newTags = [];

            if (tags !== null) {
                data.tags = tags;
                removeTags = _.differenceWith(question.tags, tags, (oldTag, newTag) => {
                    return oldTag.id.toString() === newTag.id.toString();
                });
                newTags = _.differenceWith(tags, question.tags, (newTag, oldTag) => {
                    return newTag.id.toString() === oldTag.id.toString();
                });
            }
            if (formData.hasOwnProperty('title')) {
                data.title = formData.title;
            }
            if (formData.hasOwnProperty('body')) {
                data.body = formData.body;
            }
            if (formData.hasOwnProperty('isPublic')) {
                data.isPublic = formData.isPublic;
            }

            question.updateAttributes(data, (err, updated) => {
                if (err) {
                    return next(err);
                }
                next(null, updated, removeTags, newTags);
            });
        };

        const updateStats = (question, removeTags, newTags, next) => {
            async.parallel({
                'removeTags': (cb) => {
                    if (removeTags.length === 0) {
                        return cb();
                    }
                    Question.app.models.SubCategory.increaseQuestionsCounts(removeTags, -1, cb);
                },
                'newTags': (cb) => {
                    if (newTags.length === 0) {
                        return cb();
                    }
                    Question.app.models.SubCategory.increaseQuestionsCounts(newTags, 1, cb);
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, question);
            });
        };

        async.waterfall([
            validateFormData,
            prepareData,
            updateQuestion,
            updateStats
        ], (err, question) => {
            if (err) {
                return callback(err);
            }
            callback(null, question);
        });
    };
};
