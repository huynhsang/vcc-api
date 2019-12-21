/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../../question/utils/helper';
import {createTask} from '../../../../queues/producers/taskManager';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Vote) => {
    Vote.voteQuestion = (userId, questionId, action, callback) => {
        const Question = Vote.app.models.Question;

        const checkConds = (next) => {
            async.parallel({
                'question': (cb) => {
                    Question.findById(questionId, {fields: ['id', 'ownerId']}, (err, question) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!question) {
                            return cb(new Error(__('err.question.notExists')));
                        }
                        if (!isActiveQuestion(question)) {
                            return cb(new Error(__('err.question.notActive')));
                        }
                        if (question.ownerId.toString() === userId.toString()) {
                            return cb(permissionErrorHandler(__('err.notAllow')));
                        }
                        cb(null, question);
                    });
                },
                'vote': (cb) => {
                    Vote.findOne({
                        where: {
                            ownerId: userId,
                            modelId: questionId,
                            modelType: Question.modelName
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
            const {question, vote} = payload;
            if (vote) {
                return Vote.updateVote(vote, action, next);
            }
            createVote(question, next);
        };

        const createVote = (question, next) => {
            Vote.create({
                modelId: question.id,
                modelType: Question.modelName,
                ownerId: userId,
                action
            }, (err, vote) => {
                if (err) {
                    return next(err);
                }
                updateStats(question, vote, next);
            });
        };

        const updateStats = (question, vote, next) => {
            async.parallel([
                (cb) => {
                    const activityName = action === VOTE_UP ? 'UP_VOTE_QUESTION' : 'DOWN_VOTE_QUESTION';
                    createTask('ACTIVITY_TASK', {
                        activityName,
                        activityModelType: Question.modelName,
                        activityModelId: question.id,
                        ownerId: userId,
                        receiverId: question.ownerId
                    }, cb);
                },
                (cb) => {
                    createTask('UPDATE_QUESTION_STATS_TASK', {id: question.id}, {model: Vote.modelName}, cb);
                }
            ], (err) => {
                if (err) {
                    return next(err);
                }
                next(null, vote.toObject(true, true, true));
            });
        };

        async.waterfall([checkConds, handleVote], callback);
    };
};
