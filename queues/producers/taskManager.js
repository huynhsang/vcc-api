import {getConnection} from '../rabbitMQ';
import TASK_DEFINITIONS from './taskDefinitions';
import {logInfo} from '../../common/services/loggerService';

const _getTask = (taskName, parameters) => {
    const taskOptions = TASK_DEFINITIONS[taskName](parameters);
    if (taskOptions) {
        return {taskName, ...taskOptions};
    }
    return null;
};

export const addTaskToQueue = (parameters, taskDefinition, done) => {
    const {title, exchange, routingKey, delay, attempts, targetRoutine} = taskDefinition;
    logInfo(`[AMQP] publishing ${title}`);
    getConnection().createConfirmChannel((err, channel) => {
        if (err) {
            return done(err);
        }
        if (targetRoutine) {
            parameters.targetRoutine = targetRoutine;
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

export const createTask = (taskName, parameters, done) => {
    if (!done) {
        done = () => {};
    }
    const taskDefinition = _getTask(taskName, parameters);
    if (!taskDefinition) {
        done(`Task is not defined ${taskName}`);
        return;
    }
    if (!taskDefinition.task) {
        addTaskToQueue(parameters, taskDefinition, done);
    } else {
        taskDefinition.task(parameters, taskDefinition, done);
    }
};
