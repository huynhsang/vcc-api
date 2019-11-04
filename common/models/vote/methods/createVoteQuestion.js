/* global __ */
import async from 'async';
import {isActiveQuestion} from '../../question/utils/helper';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Vote) => {
    Vote.createVoteQuestion = (userId, questionId, action, callback) => {
        const getQuestion = (next) => {
            Vote.app.models.Question.findById(questionId, {}, (err, question) => {
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
                ownerId: userId,
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
                    Vote.app.models.Reputation.upsertVoteQuestion(question, userId, action, (err) => {
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
                    Vote.app.models.user.updateStats(question.ownerId, {attribute: 'points'}, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                },
                'question': (cb) => {
                    const attribute = action === VOTE_UP ? 'upVoteCount' : 'downVoteCount';
                    Vote.app.models.Question.increaseCount(question.id, attribute, 1, cb);
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
