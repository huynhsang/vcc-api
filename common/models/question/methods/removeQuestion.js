/* global __ */
import async from 'async';
import {permissionErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion, isRemovedQuestion} from '../utils/helper';
import {createTask} from '../../../../queues/producers/taskManager';

export default function (Question) {
    Question.removeQuestion = (userId, questionId, isAdmin, callback) => {
        if (typeof isAdmin === 'function') {
            callback = isAdmin;
            isAdmin = false;
        }
        const loadData = (next) => {
            Question.findById(questionId, (err, question) => {
                if (err) {
                    return next(err);
                }
                if (isRemovedQuestion(question)) {
                    return next(new Error(__('err.question.notExist')));
                }
                if (!isAdmin && !isActiveQuestion(question)) {
                    return next(new Error(__('err.question.notActive')));
                }
                if (!isAdmin && String(userId) !== String(question.ownerId)) {
                    return next(permissionErrorHandler(__('err.notAllow')));
                }
                next(null, question);
            });
        };

        const removeData = (question, next) => {
            const removedItem = new Question.app.models.Remove({
                removedUserId: userId,
                removedOn: new Date()
            });
            question.updateAttributes({
                disabled: true,
                removedItem
            }, (err) => {
                next(err, question);
            });
        };

        const updateStats = (question, next) => {
            async.parallel({
                'Activities': cb => {
                    Question.app.models.Activity.findOne({
                        activityName: 'POST_QUESTION',
                        activityModelType: Question.modelName,
                        activityModelId: question.id,
                        ownerId: question.ownerId
                    }, (err, activity) => {
                        if (err) {
                            return cb(err);
                        }
                        createTask('REMOVE_ACTIVITY_TASK', {activityId: activity.id}, cb);
                    });
                },
                'category': (cb) => {
                    createTask('UPDATE_CATEGORY_STATS_TASK', {id: question.categoryItem.id}, {model: Question.modelName}, cb);
                },
                'tags': (cb) => {
                    Question.app.models.Tag.increaseQuestionCounts(question.tagList, -1, cb);
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
