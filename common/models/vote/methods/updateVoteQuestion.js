/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Vote) => {
    Vote.updateVoteQuestion = (loggedInUser, id, action, callback) => {
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
            const question = vote.__data.model;
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
                    Vote.app.models.Reputation.upsertVoteQuestion(question, loggedInUser, action, (err) => {
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
                next(null, question, result.vote);
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
