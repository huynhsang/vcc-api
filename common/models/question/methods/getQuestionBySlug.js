/* global __ */
import async from 'async';
import {normalizeIncludeFields} from '../../../utils/filterUtils';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';

export default (Question) => {
    Question.getQuestionBySlug = (slug, filter, callback) => {
        const getQuestion = (next) => {
            const fields = normalizeIncludeFields(filter.fields);
            const query = filter.where || {};
            query.slug = slug;
            query.disabled = false;
            query.removedItem = {$exists: false};

            const mongoConnector = Question.getDataSource().connector;
            mongoConnector.collection(Question.modelName).findOneAndUpdate(
                query,  // query
                {
                    '$inc': {
                        'viewCount': 1
                    },
                    '$set': {
                        'modified': new Date()
                    }
                },
                {
                    returnOriginal: false,
                    projection: fields
                }, (err, _doc) => {
                    if (err) {
                        return next(err);
                    }
                    if (!_doc || !_doc.value) {
                        return next(notFoundErrorHandler(__('err.question.notExists')));
                    }
                    _doc.value.id = _doc.value._id;
                    delete _doc.value._id;
                    return next(null, _doc.value);
                });
        };

        const getRelatedModels = (question, next) => {
            async.parallel({
                askedBy: (cb) => {
                    Question.app.models.user.findById(question.ownerId, (err, user) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!user) {
                            return cb(null, null);
                        }
                        cb(null, user.toObject(true, true, true));
                    });
                },
                answers: (cb) => {
                    const include = [{
                        relation: 'answerBy',
                        scope: {
                            fields: ['id', 'avatar', 'username', 'firstName', 'lastName', 'questionCount',
                                'answerCount', 'bestAnswers', 'points', 'badgeItem', 'showRealName']
                        }
                    }];
                    Question.app.models.Answer.find({
                        where: {
                            questionId: question.id
                        },
                        limit: 10,
                        order: 'created DESC',
                        include
                    }, (err, answers) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, answers);
                    });
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                question.askedBy = result.askedBy;
                question.answers = result.answers;
                next(null, question);
            });
        };

        async.waterfall([
            getQuestion,
            getRelatedModels
        ], (err, question) => {
            if (err) {
                return callback(err);
            }
            callback(null, question);
        });
    };
};
