import async from 'async';
import loopback from 'loopback';
import {logError, logInfo} from '../common/services/loggerService';
import {TASK_ACTIVE, TASK_ERROR} from './queueConstant';
import {getTask} from './producers/taskManager';

export const requeue = (channel, exchange, routingKey, msg, callback) => {
    const data = msg.content.toString();
    const attempts = msg.properties.headers['x-retry-count'] || 0;
    const delay = msg.properties.headers['x-delay'] || 0;
    if (attempts > 0) {
        return channel.publish(exchange, routingKey, Buffer.from(data),
            {headers: {'x-delay': delay, 'x-retry-count': attempts - 1}}, (err) => {
                if (err) {
                    return callback(err);
                }
                logInfo(` [x] Re-sent ${routingKey}: ${data} `);
                callback(null, true);
            });
    }
    callback(null, false);
};

export const processingTask = (taskId, handlerFn, callback) => {
    if (typeof handlerFn !== 'function' || !taskId) {
        return callback && callback();
    }
    const QueueTask = loopback.getModel('QueueTask');
    let currentTask;
    async.waterfall([
        (next) => {
            QueueTask.updateTaskStatus(taskId, TASK_ACTIVE, (err, task) => {
                if (err) {
                    return next(err);
                }
                currentTask = task;
                next();
            });
        },
        (next) => {
            if (!currentTask) {
                return next();
            }
            const data = currentTask.data || {};
            const taskDefinition = getTask(currentTask.name, data);
            if (taskDefinition.targetRoutine) {
                data.targetRoutine = taskDefinition.targetRoutine;
            }
            handlerFn(data, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        },
        (next) => {
            QueueTask.deleteById(taskId, next);
        }
    ], (err) => {
        if (!err) {
            return callback();
        }
        if (currentTask) {
            return QueueTask.update({id: taskId}, {status: TASK_ERROR}, (_err) => {
                if (_err) {
                    logError(_err);
                }
                callback(err);
            });
        }
        callback(err);
    });
};
