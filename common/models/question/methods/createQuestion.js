/* global __ */
import _ from 'lodash';
import async from 'async';
import Joi from 'joi';
import {
    MAX_BODY_LENGTH,
    MIN_BODY_LENGTH,
    SUPPORTER_FIELDS,
    TITLE_MAX_LENGTH,
    TITLE_MIN_LENGTH
} from '../../../../configs/constants/serverConstant';
import {validationErrorHandler} from '../../../utils/modelHelpers';
import {slugify} from '../../../utils/validationUtils';
import * as shortid from 'shortid';

export default (Question) => {
    Question.createQuestion = (loggedInUser, formData, callback) => {
        const validateFormData = (next) => {
            const schema = Joi.object().keys({
                categoryId: Joi.string().hex().length(24).required(),
                tagIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
                supporterIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
                title: Joi.string().trim().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH).required(),
                body: Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required(),
                isPublic: Joi.boolean().default(true)
            }).required();

            schema.validate(formData, {allowUnknown: false, stripUnknown: true}, (err, validated) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                formData = validated;
                next();
            });
        };

        const prepareData = (next) => {
            async.parallel({
                'category': (cb) => {
                    Question.app.models.Category.findById(formData.categoryId, (err, category) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!category) {
                            return cb(new Error(__('err.category.notExists')));
                        }
                        cb(null, category.toObject(false, true, true));
                    });
                },
                'tags': (cb) => {
                    if (!formData.tagIds || formData.tagIds.length === 0) {
                        return cb(null, []);
                    }
                    Question.app.models.Tag.find({
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
                            return cb(new Error(__('err.tag.notExists')));
                        }
                        cb(null, tags.map(item => item.toObject(false, true, true)));
                    });
                },
                'supporters': (cb) => {
                    if (!formData.supporterIds || formData.supporterIds.length === 0) {
                        return cb(null, []);
                    }
                    Question.app.models.user.find({
                        where: {
                            isEnable: true,
                            id: {
                                inq: formData.supporterIds
                            }
                        }
                    }, (err, supporters) => {
                        if (err) {
                            return cb(err);
                        }
                        if (supporters.length !== formData.supporterIds.length) {
                            return cb(new Error(__('err.user.notExists')));
                        }
                        cb(null, supporters.map(user => _.pick(user, SUPPORTER_FIELDS)));
                    });
                }
            }, (err, payload) => {
                if (err) {
                    return next(err);
                }
                next(null, payload);
            });
        };

        const saveQuestion = (payload, next) => {
            const {category, tags, supporters} = payload;
            const slug = slugify(formData.title);
            const data = {
                categoryItem: category,
                tagList: tags,
                supporterList: supporters,
                title: formData.title,
                body: formData.body,
                isPublic: formData.isPublic,
                shortId: shortid.generate(),
                ownerId: loggedInUser.id,
                slug
            };
            Question.create(data, (err, question) => {
                if (err) {
                    return next(err);
                }
                next(null, question);
            });
        };

        const updateStats = (question, next) => {
            async.parallel({
                'category': (cb) => {
                    Question.app.models.Category.increaseQuestionCount(question.categoryItem.id, 1, cb);
                },
                'tags': (cb) => {
                    Question.app.models.Tag.increaseQuestionCounts(question.tagList, 1, cb);
                },
                'user': (cb) => {
                    Question.app.models.user.increaseQuestionCount(loggedInUser.id, 1, cb);
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
            saveQuestion,
            updateStats
        ], (err, question) => {
            if (err) {
                return callback(err);
            }
            callback(null, question);
        });
    };
};
