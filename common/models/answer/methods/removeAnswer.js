/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveAnswer} from '../utils/helper';
import {createTask} from '../../../../queues/producers/taskManager';

export default function (Answer) {
    Answer.removeAnswer = (userId, answerId, isAdmin, callback) => {
        if (typeof isAdmin === 'function') {
            callback = isAdmin;
            isAdmin = false;
        }
        const loadData = (next) => {
            Answer.findById(answerId, (err, answer) => {
                if (err) {
                    return next(err);
                }
                if (!isActiveAnswer(answer)) {
                    return next(new Error(__('err.answer.notActive')));
                }
                if (!isAdmin && String(userId) !== String(answer.ownerId)) {
                    return next(permissionErrorHandler(__('err.notAllow')));
                }
                next(null, answer);
            });
        };

        const removeData = (answer, next) => {
            answer.destroy((err) => {
                if (err) {
                    return next(err);
                }
                Answer.app.models.Vote.destroyAll({modelId: answer.id, modelType: Answer.modelName}, (_err) => {
                    if (_err) {
                        return next(_err);
                    }
                    next(null, answer);
                });
            });
        };

        const updateStats = (answer, next) => {
            async.parallel({
                'Activities': cb => {
                    Answer.app.models.Activity.findOne({
                        activityName: 'POST_ANSWER',
                        activityModelType: Answer.modelName,
                        activityModelId: answer.id,
                        ownerId: answer.ownerId
                    }, (err, activity) => {
                        if (err) {
                            return cb(err);
                        }
                        createTask('REMOVE_ACTIVITY_TASK', {activityId: activity.id}, cb);
                    });
                },
                'question': (cb) => {
                    createTask('UPDATE_QUESTION_STATS_TASK', {id: answer.questionId}, {model: Answer.modelName}, cb);
                }
            }, (err) => {
                if (err) {
                    return next();
                }
                next();
            });
        };

        async.waterfall([
            loadData,
            removeData,
            updateStats
        ], (err) => {
            if (err) {
                return callback(err);
            }
            callback();
        });
    };
};
