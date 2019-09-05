/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';
import serverConstant from '../../../../configs/constants/serverConstant';

export default function (UserVoteAnswer) {
    /**
     * The method responsible for validate data before saving
     * @param data: {Object} The data of userVoteAnswer
     * @param callback: {Function} The callback function
     */
    UserVoteAnswer.validateBeforeSave = function (data, callback) {
        const Answer = UserVoteAnswer.app.models.Answer;
        Answer.findById(data.answerId, (err, _answer) => {
            if (err) {
                return callback(err);
            }
            if (!_answer) {
                return callback(notFoundErrorHandler(__('err.answer.notExists')));
            }
            if (_answer.createdBy === data.userId) {
                return callback(new Error(__('err.answer.voteIsDenied')));
            }
            callback();
        });
    };

    /**
     * The method handles logic after save an instance of UserVoteAnswer
     * @param data: {Object} The instance of UserVoteAnswer
     * @param number: {Number} The number will be increase/reduce
     * @param callback: {Function} The callback function
     */
    UserVoteAnswer.handleAfterSave = function (data, number, callback) {
        const Answer = UserVoteAnswer.app.models.Answer;
        const Reputation = UserVoteAnswer.app.models.Reputation;
        const User = UserVoteAnswer.app.models.user;

        const updateRelatedModel = function (answer, next) {
            const isNewInstance = number % 2 !== 0;
            let point = serverConstant.REPUTATION_POINT.DOWN_VOTE;
            let action = serverConstant.REPUTATION_ACTION.DOWN_VOTE;
            if (data.isPositiveVote) {
                point = serverConstant.REPUTATION_POINT.UP_VOTE;
                action = serverConstant.REPUTATION_ACTION.UP_VOTE;
            }

            const _updateReputation = function (cb) {
                const reputationData = {
                    action,
                    point,
                    ownerId: answer.createdBy,
                    questionId: answer.questionId,
                    answerId: answer.id,
                    createdBy: data.userId,
                    updatedBy: data.userId
                };
                if (isNewInstance) {
                    Reputation.upsert(reputationData, (err, _reputation) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, _reputation);
                    });
                } else {
                    const updateData = {
                        action,
                        point
                    };
                    Reputation.updateAll({
                        questionId: answer.questionId,
                        answerId: answer.id,
                        createdBy: data.userId,
                        action: {
                            neq: serverConstant.REPUTATION_ACTION.ACCEPT
                        }
                    }, updateData, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, reputationData);
                    });
                }
            };

            const _updateUser = function (reputation, cb) {
                User.updatePoint(reputation, isNewInstance, (err) => {
                    if (err) {
                        return cb(err);
                    }
                    cb();
                });
            };

            async.waterfall([
                _updateReputation,
                _updateUser
            ], (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        };

        async.waterfall([
            (next) => {
                Answer.updateAmountOfProperties(data.answerId, 'numberOfVotes', number, (err, _answer) => {
                    if (err) {
                        return next(err);
                    }
                    next(null, _answer);
                });
            },
            updateRelatedModel
        ], (err) => {
            if (err) {
                return callback(err);
            }
            callback();
        });
    };
}
