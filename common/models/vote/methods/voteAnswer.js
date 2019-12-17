/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {createTask} from '../../../../queues/producers/taskManager';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';
import {isActiveAnswer} from '../../answer/utils/helper';

export default (Vote) => {
    Vote.voteAnswer = (userId, answerId, action, callback) => {
        const Answer = Vote.app.models.Answer;

        const checkConds = (next) => {
            async.parallel({
                'answer': (cb) => {
                    Answer.findById(answerId, {fields: ['id', 'ownerId']}, (err, answer) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!answer) {
                            return cb(new Error(__('err.answer.notExists')));
                        }
                        if (!isActiveAnswer(answer)) {
                            return cb(new Error(__('err.answer.notActive')));
                        }
                        if (answer.ownerId.toString() === userId.toString()) {
                            return cb(permissionErrorHandler(__('err.notAllow')));
                        }
                        cb(null, answer);
                    });
                },
                'vote': (cb) => {
                    Vote.findOne({
                        where: {
                            ownerId: userId,
                            modelId: answerId,
                            modelType: Answer.modelName
                        }
                    }, (err, vote) => {
                        if (err) {
                            return cb(err);
                        }
                        if (vote && vote.action === action) {
                            return cb(new Error(__('err.voted')));
                        }
                        cb(null, vote);
                    });
                }
            }, next);
        };

        const handleVote = (payload, next) => {
            const {answer, vote} = payload;
            if (vote) {
                return vote.updateAttribute('action', action, (err, _vote) => {
                    if (err) {
                        return next(err);
                    }
                    createTask('AFTER_REMOVE_VOTE_TASK', {
                        modelId: answer.id,
                        modelType: Answer.modelName,
                        ownerId: userId,
                        action
                    });
                    next(null, answer, _vote);
                });
            }

            Vote.create({
                modelId: answer.id,
                modelType: Answer.modelName,
                ownerId: userId,
                action
            }, (err, _vote) => {
                if (err) {
                    return next(err);
                }
                next(null, answer, _vote);
            });
        };

        const updateStats = (answer, vote, next) => {
            async.parallel([
                (cb) => {
                    const activityName = action === VOTE_UP ? 'UP_VOTE_ANSWER' : 'DOWN_VOTE_ANSWER';
                    createTask('ACTIVITY_TASK', {
                        activityName,
                        activityModelType: Answer.modelName,
                        activityModelId: answer.id,
                        ownerId: userId,
                        receiverId: answer.ownerId
                    }, cb);
                },
                (cb) => {
                    const attribute = action === VOTE_UP ? 'upVoteCount' : 'downVoteCount';
                    Vote.app.models.Answer.increaseCount(answer.id, attribute, 1, cb);
                }
            ], (err) => {
                if (err) {
                    return next(err);
                }
                next(null, vote.toObject(true, true, true));
            });
        };

        async.waterfall([checkConds, handleVote, updateStats], callback);
    };
};
