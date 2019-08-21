/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../modelUtils/modelHelpers';
import * as appConstant from '../../../constants/appConstant';

export default function (UserVoteQuestion) {
    /**
     * The method responsible for validate data before saving
     * @param data: {Object} The data of userVoteQuestion
     * @param callback: {Function} The callback function
     */
    UserVoteQuestion.validateBeforeSave = function (data, callback) {
        const Question = UserVoteQuestion.app.models.Question;
        Question.findById(data.questionId, (err, _question) => {
            if (err) {
                return callback(err);
            }
            if (!_question) {
                return callback(notFoundErrorHandler(__('err.question.notExists')));
            }
            if (_question.createdBy === data.userId) {
                return callback(new Error(__('err.question.voteIsDenied')));
            }
            callback();
        });
    };

    /**
     * The method handles logic after save an instance of UserVoteQuestion
     * @param data: {Object} The instance of UserVoteQuestion
     * @param number: {Number} The number will be increase/reduce
     * @param callback: {Function} The callback function
     */
    UserVoteQuestion.handleAfterSave = function (data, number, callback) {
        const Question = UserVoteQuestion.app.models.Question;
        const Reputation = UserVoteQuestion.app.models.Reputation;
        const User = UserVoteQuestion.app.models.user;

        const updateRelatedModel = function (question, next) {
            const isNewInstance = number % 2 !== 0;
            let point = appConstant.REPUTATION_POINT.DOWN_VOTE;
            let action = appConstant.REPUTATION_ACTION.DOWN_VOTE;
            if (data.isPositiveVote) {
                point = appConstant.REPUTATION_POINT.UP_VOTE;
                action = appConstant.REPUTATION_ACTION.UP_VOTE;
            }

            const _updateReputation = function (cb) {
                const reputationData = {
                    action,
                    point,
                    ownerId: question.createdBy,
                    answerId: null,
                    questionId: question.id,
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
                        questionId: data.questionId,
                        answerId: null,
                        createdBy: data.userId,
                        action: {
                            neq: appConstant.REPUTATION_ACTION.ACCEPT
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
                Question.updateAmountOfProperties(data.questionId, 'numberOfVotes', number, (err, _question) => {
                    if (err) {
                        return next(err);
                    }
                    next(null, _question);
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
