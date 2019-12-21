/* global __ */
import async from 'async';
import {isActiveAnswer} from '../../answer/utils/helper';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../utils/helper';
import {createTask} from '../../../../queues/producers/taskManager';

export default (Question) => {
    Question.approveAnswer = (questionId, answerId, userId, callback) => {
        // TODO: ADD JOB HANDLE ROLLBACK ROLL FORWARD
        const checkConditions = (next) => {
            async.parallel({
                'answer': (cb) => {
                    Question.app.models.Answer.findOne({
                        where: {
                            id: answerId,
                            questionId
                        }
                    }, (err, answer) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!answer) {
                            return cb(new Error(__('error.answer.notExists')));
                        }
                        if (!isActiveAnswer(answer)) {
                            return cb(new Error(__('err.answer.notActive')));
                        }
                        if (answer.isTheBest) {
                            return cb(new Error(__('err.answer.approved')));
                        }
                        if (String(answer.ownerId) === String(userId)) {
                            return cb(permissionErrorHandler());
                        }
                        cb(null, answer);
                    });
                },
                'question': (cb) => {
                    Question.findById(questionId, (err, question) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!question) {
                            return cb(new Error(__('err.question.notExists')));
                        }
                        if (!isActiveQuestion(question)) {
                            return cb(new Error(__('err.question.notActive')));
                        }
                        if (String(question.ownerId) !== String(userId)) {
                            return cb(permissionErrorHandler());
                        }
                        if (question.bestAnswerItem) {
                            return cb(new Error(__('err.question.hadTheBest')));
                        }
                        cb(null, question);
                    });
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                next(null, result);
            });
        };

        const updateBestAnswer = (payload, next) => {
            async.parallel({
                'answer': (cb) => {
                    payload.answer.updateAttribute('isTheBest', true, (err, updated) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, updated);
                    });
                },
                'question': (cb) => {
                    payload.answer.isTheBest = true;
                    payload.question.updateAttribute('bestAnswerItem', payload.answer.toObject(false, true, true), (err, updated) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, updated);
                    });
                }
            }, next);
        };

        const updateStats = (data, next) => {
            async.parallel([
                (cb) => {
                    createTask('ACTIVITY_TASK', {
                        activityName: 'APPROVE_ANSWER',
                        activityModelType: Question.app.models.Answer.modelName,
                        activityModelId: answerId,
                        ownerId: userId,
                        receiverId: data.answer.ownerId
                    }, () => {
                        cb();
                    });
                },
                (cb) => {
                    createTask('UPDATE_USER_STATS_TASK', {id: data.answer.ownerId}, {attribute: 'bestAnswers'}, () => {
                        cb();
                    });
                }
                // Todo: add notification
            ], (err) => {
                next(err, data);
            });
        };

        async.waterfall([
            checkConditions,
            updateBestAnswer,
            updateStats
        ], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    };
};
