/* global __ */
import async from 'async';
import {isActiveAnswer} from '../../answer/utils/helper';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../../question/utils/helper';

export default (Answer) => {
    Answer.approve = (answerId, loggedInUser, callback) => {
        // TODO: ADD JOB HANDLE ROLLBACK ROLL FORWARD
        const getAnswer = (next) => {
            Answer.findById(answerId, {
                include: 'question'
            }, (err, answer) => {
                if (err) {
                    return next(err);
                }
                if (!answer) {
                    return next(new Error(__('error.answer.notExists')));
                }
                if (!isActiveAnswer(answer)) {
                    return next(new Error(__('err.answer.notActive')));
                }
                if (answer.isTheBest) {
                    return next(new Error(__('err.answer.approved')));
                }
                if (answer.ownerId.toString() === loggedInUser.id.toString()) {
                    return next(permissionErrorHandler());
                }

                // For question
                const question = answer.__data.question;
                if (!question) {
                    return next(new Error(__('err.question.notExists')));
                }
                if (!isActiveQuestion(question)) {
                    return next(new Error(__('err.question.notActive')));
                }
                if (question.ownerId.toString() !== loggedInUser.id.toString()) {
                    return next(permissionErrorHandler());
                }
                if (question.bestAnswerItem) {
                    return next(new Error(__('err.question.hadTheBest')));
                }
                delete answer.__data.question;
                next(null, {answer, question});
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
                    Answer.app.models.Reputation.createApprove(data.question, data.answer, (err) => {
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
                next(null, data.answer);
            });
        };

        const updateStats = (answer, next) => {
            Answer.app.models.user.updateStats(answer.ownerId, {attribute: 'bestAnswers'}, () => {
                next(null, answer);
            });
        };

        async.waterfall([
            getAnswer,
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
