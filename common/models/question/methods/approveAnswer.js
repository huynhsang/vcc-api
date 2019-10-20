/* global __ */
import async from 'async';
import {isActiveAnswer} from '../../answer/utils/helper';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../utils/helper';

export default (Question) => {
    Question.approveAnswer = (questionId, answerId, loggedInUser, callback) => {
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
                        if (answer.ownerId.toString() === loggedInUser.id.toString()) {
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
                        if (question.ownerId.toString() !== loggedInUser.id.toString()) {
                            return cb(permissionErrorHandler());
                        }
                        if (question.bestAnswer) {
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
                    payload.question.updateAttribute('bestAnswer', payload.answer.toObject(false, true, true), (err, updated) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, updated);
                    });
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                next(null, result);
            });
        };

        const updateRelatedModels = (data, next) => {
            async.parallel({
                'reputation': (cb) => {
                    Question.app.models.Reputation.createApprove(data.question, data.answer, (err) => {
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
                next(null, data);
            });
        };

        const updateStats = (data, next) => {
            Question.app.models.user.updateStats(data.answer.ownerId, {type: 'bestAnswers'}, () => {
                next(null, data);
            });
        };

        async.waterfall([
            checkConditions,
            updateBestAnswer,
            updateRelatedModels,
            updateStats
        ], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    };
};
