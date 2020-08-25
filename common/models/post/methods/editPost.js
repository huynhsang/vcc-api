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
import {permissionErrorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default (Post) => {
    Post.editPost = (loggedInUser, formData, callback) => {
        const validateFormData = (next) => {
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                tagIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
                characterIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
                title: Joi.string().trim().min(TITLE_MIN_LENGTH).max(TITLE_MAX_LENGTH).required(),
                body: Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required(),
                coverImage: Joi.string().trim().optional(),
                resume: Joi.string().trim().optional()
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
                'post': (cb) => {
                    Post.findById(formData.id, (err, post) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!post) {
                            return cb(new Error(__('err.post.notExits')));
                        }
                        if (String(post.authorId) !== String(loggedInUser.id)) {
                            return cb(permissionErrorHandler());
                        }
                        cb(null, post);
                    });
                },
                'tags': (cb) => {
                    if (!formData.tagIds || formData.tagIds.length === 0) {
                        return cb(null, []);
                    }
                    Post.app.models.Tag.find({
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
                'characters': (cb) => {
                    if (!formData.characterIds || formData.characterIds.length === 0) {
                        return cb(null, []);
                    }
                    Post.app.models.user.find({
                        where: {
                            isEnable: true,
                            id: {
                                inq: formData.characterIds
                            }
                        }
                    }, (err, characters) => {
                        if (err) {
                            return cb(err);
                        }
                        if (characters.length !== formData.supporterIds.length) {
                            return cb(new Error(__('err.user.notExists')));
                        }
                        cb(null, characters.map(user => _.pick(user, SUPPORTER_FIELDS)));
                    });
                },
                'images': (cb) => {
                    if (!formData.coverImage) {
                        return cb(null, []);
                    }
                    const img = new Post.app.models.Image();
                    img.lrg = formData.coverImage;
                    return cb(null, [img]);
                }
            }, (err, payload) => {
                if (err) {
                    return next(err);
                }
                next(null, payload);
            });
        };

        const updatePost = (payload, next) => {
            const {post, tags, characters, images} = payload;
            const data = {};
            let removeTags = [];
            let newTags = [];

            if (tags) {
                data.tagList = tags;
                removeTags = _.differenceWith(post.tagList, tags, (oldTag, newTag) => {
                    return oldTag.id.toString() === newTag.id.toString();
                });
                newTags = _.differenceWith(tags, post.tagList, (newTag, oldTag) => {
                    return newTag.id.toString() === oldTag.id.toString();
                });
            }
            if (formData.hasOwnProperty('title')) {
                data.title = formData.title;
            }
            if (formData.hasOwnProperty('body')) {
                data.body = formData.body;
            }
            if (characters) {
                data.characterList = characters;
            }
            if (images) {
                data.imageList = images;
            }

            post.updateAttributes(data, (err, updated) => {
                if (err) {
                    return next(err);
                }
                next(null, updated, removeTags, newTags);
            });
        };

        const updateStats = (post, removeTags, newTags, next) => {
            const Tag = Post.app.models.Tag;
            async.parallel({
                'removeTags': (cb) => {
                    if (removeTags.length === 0) {
                        return cb();
                    }
                    Tag.increaseCount(removeTags, Tag.POST_COUNT_FIELD, -1, cb);
                },
                'newTags': (cb) => {
                    if (newTags.length === 0) {
                        return cb();
                    }
                    Tag.increaseCount(newTags, Tag.POST_COUNT_FIELD, 1, cb);
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, post);
            });
        };

        async.waterfall([
            validateFormData,
            prepareData,
            updatePost,
            updateStats
        ], (err, post) => {
            if (err) {
                return callback(err);
            }
            callback(null, post);
        });
    };
};
