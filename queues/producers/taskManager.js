import loopback from 'loopback';
import {getConnection} from '../rabbitMQ';
import TASK_DEFINITIONS from './taskDefinitions';
import {logInfo} from '../../common/services/loggerService';

export const getTask = (taskName, parameters) => {
    const taskOptions = TASK_DEFINITIONS[taskName](parameters);
    if (taskOptions) {
        return {taskName, ...taskOptions};
    }
    return null;
};

export const addTaskToQueue = (parameters, taskDefinition, done) => {
    const {title, exchange, routingKey, delay, attempts} = taskDefinition;
    logInfo(`[AMQP] publishing ${title}`);
    getConnection().createConfirmChannel((err, channel) => {
        if (err) {
            return done(err);
        }
        const msg = JSON.stringify(parameters);
        channel.publish(exchange, routingKey, Buffer.from(msg), {headers: {'x-delay': delay, 'x-retry-count': attempts}}, (_err) => {
            if (_err) {
                return done(_err);
            }
            logInfo(` [x] Sent ${routingKey}: ${msg} `);
            channel.close(() => {
                done();
            });
        });
    });
};

export const createTask = (taskName, parameters, options, done) => {
    if (typeof options === 'function') {
        done = options;
        options = {};
    }
    if (!done) {
        done = () => {};
    }
    parameters.options = options;
    const taskDefinition = getTask(taskName, parameters);
    if (!taskDefinition) {
        done(`Task is not defined ${taskName}`);
        return;
    }

    const QueueTask = loopback.getModel('QueueTask');
    if (taskDefinition.unique) {
        return QueueTask.getTaskByTitle(taskDefinition.title, (err, task) => {
            if (err) {
                return done(err);
            }
            if (task) {
                return done();
            }
            QueueTask.initTask(taskDefinition, parameters, done);
        });
    }
    QueueTask.initTask(taskDefinition, parameters, done);
};
