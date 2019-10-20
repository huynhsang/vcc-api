/* global __ */
import async from 'async';
import {isActiveQuestion} from '../../question/utils/helper';

export default (Vote) => {
    Vote.createVoteQuestion = (loggedInUser, questionId, action, callback) => {
        const getQuestion = (next) => {
            Vote.app.models.Question.findById(questionId, (err, question) => {
                if (err) {
                    return next(err);
                }
                if (!question) {
                    return next(new Error(__('err.question.notExists')));
                }
                if (!isActiveQuestion(question)) {
                    return next(new Error(__('err.question.notActive')));
                }
                next(null, question.toObject(true, true, true));
            });
        };

        const createVote = (question, next) => {
            const data = {
                modelId: question.id,
                modelType: Vote.app.models.Question.modelName,
                ownerId: loggedInUser.id,
                action
            };

            Vote.findOrCreate({where: data}, data, (err, instance, created) => {
                if (err) {
                    return next(err);
                }
                if (!created) {
                    return next(new Error(__('err.vote.alreadyExists')));
                }
                next(null, question, instance);
            });
        };

        const updateRelatedModels = (question, vote, next) => {
            async.parallel({
                'reputation': (cb) => {
                    Vote.app.models.Reputation.upsertVoteQuestion(question, loggedInUser, action, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                },
                'notification': (cb) => {
                    cb();
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, question, vote);
            });
        };

        const updateStats = (question, vote, next) => {
            async.parallel({
                'user': (cb) => {
                    Vote.app.models.user.updateStats(question.ownerId, {type: 'points'}, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                },
                'question': (cb) => {
                    Vote.app.models.Question.updateStats(question.id, {model: Vote.modelName}, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, vote);
            });
        };

        async.waterfall([
            getQuestion,
            createVote,
            updateRelatedModels,
            updateStats
        ], (err, vote) => {
            if (err) {
                return callback(err);
            }
            callback(null, vote);
        });
    };
};
