import async from 'async';
import {TASK_PENDING} from '../../../../queues/queueConstant';
import {addTaskToQueue} from '../../../../queues/producers/taskManager';
import {logError} from '../../../services/loggerService';

export default (QueueTask) => {
    QueueTask.initTask = (taskDefinition, data, callback) => {
        let newTask;
        async.waterfall([
            (next) => {
                QueueTask.create({
                    title: taskDefinition.title,
                    status: TASK_PENDING,
                    name: taskDefinition.taskName,
                    data
                }, (err, task) => {
                    if (err) {
                        return next(err);
                    }
                    newTask = task;
                    next();
                });
            },
            (next) => {
                if (!taskDefinition.task) {
                    addTaskToQueue({taskId: newTask.id.toString()}, taskDefinition, next);
                } else {
                    taskDefinition.task({taskId: newTask.id.toString()}, taskDefinition, next);
                }
            }
        ], (err) => {
            if (!err) {
                return callback(null, newTask);
            }
            if (newTask) {
                return QueueTask.deleteById(newTask.id, (_err) => {
                    if (_err) {
                        logError(_err);
                    }
                    callback(err);
                });
            }
            callback(err);
        });
    };
};
