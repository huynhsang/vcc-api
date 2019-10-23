/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';

export default (Vote) => {
    Vote.updateVoteAnswer = (loggedInUser, id, action, callback) => {
        const preCondition = (next) => {
            Vote.findById(id, {
                include: 'model'
            }, (err, vote) => {
                if (err) {
                    return next(err);
                }
                if (!vote) {
                    return next(new Error(__('err.vote.notExists')));
                }
                if (vote.ownerId.toString() !== loggedInUser.id.toString()) {
                    return next(permissionErrorHandler());
                }
                if (vote.action === action) {
                    return next(new Error(__('err.vote.updated')));
                }
                next(null, vote);
            });
        };

        const updateModels = (vote, next) => {
            const answer = vote.__data.model;
            async.parallel({
                vote: (cb) => {
                    vote.updateAttribute('action', action, (err, updated) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, updated);
                    });
                },
                reputation: (cb) => {
                    Vote.app.models.Reputation.upsertVoteAnswer(answer, loggedInUser, action, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                next(null, answer, result.vote);
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
                    Vote.app.models.Answer.updateStats(answer.id, {model: Vote.modelName}, (err) => {
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
            preCondition,
            updateModels,
            updateStats
        ], (err, vote) => {
            if (err) {
                return callback(err);
            }
            callback(null, vote);
        });
    };
};
