/* global __ */
import async from 'async';
import {isActiveAnswer} from '../../answer/utils/helper';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Vote) => {
    Vote.createVoteAnswer = (loggedInUser, answerId, action, callback) => {
        const getAnswer = (next) => {
            Vote.app.models.Answer.findById(answerId, (err, answer) => {
                if (err) {
                    return next(err);
                }
                if (!answer) {
                    return next(new Error(__('err.answer.notExists')));
                }
                if (!isActiveAnswer(answer)) {
                    return next(new Error(__('err.answer.notActive')));
                }
                next(null, answer.toObject(true, true, true));
            });
        };

        const createVote = (answer, next) => {
            const data = {
                modelId: answer.id,
                modelType: Vote.app.models.Answer.modelName,
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
                next(null, answer, instance);
            });
        };

        const updateRelatedModels = (answer, vote, next) => {
            async.parallel({
                'reputation': (cb) => {
                    Vote.app.models.Reputation.upsertVoteAnswer(answer, loggedInUser, action, (err) => {
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
                next(null, answer, vote);
            });
        };

        const updateStats = (answer, vote, next) => {
            async.parallel({
                'user': (cb) => {
                    Vote.app.models.user.updateStats(answer.ownerId, {attribute: 'points'}, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                },
                'answer': (cb) => {
                    const attribute = action === VOTE_UP ? 'upVotesCount' : 'downVotesCount';
                    Vote.app.models.Answer.increaseCount(answer.id, attribute, 1, cb);
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, vote);
            });
        };

        async.waterfall([
            getAnswer,
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
