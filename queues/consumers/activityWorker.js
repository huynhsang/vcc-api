import _ from 'lodash';
import {logError, logInfo} from '../../common/services/loggerService';
import {DEFAULT_EXCHANGE_DIRECT, ACTIVITY_QUEUE} from '../queueConstant';
import {processingTask, requeue} from '../queueUtils';

module.exports = (connection, app) => {
    const handleDelivery = (data, callback) => {
        const routine = _.get(app, data.targetRoutine);
        delete data.targetRoutine;
        if (!routine) {
            return callback('Job targetRoutine missing!');
        }
        routine(data, callback);
    };

    connection.createChannel((error, channel) => {
        if (error) {
            return logError(error, () => {
                throw error;
            });
        }

        channel.on('error', (err) => {
            logError(`[AMQP] ${ACTIVITY_QUEUE} channel error ${err.message}`);
        });

        channel.on('close', () => {
            logInfo(`[AMQP] ${ACTIVITY_QUEUE} channel closed`);
        });

        channel.prefetch(50);
        channel.assertQueue(ACTIVITY_QUEUE, {
            durable: true
        }, (_error, ok) => {
            if (_error) {
                return logError(_error, () => {
                    throw _error;
                });
            }
            logInfo(` [*] Waiting for messages in ${ACTIVITY_QUEUE}`);
            channel.bindQueue(ok.queue, DEFAULT_EXCHANGE_DIRECT, ACTIVITY_QUEUE);
            channel.consume(ACTIVITY_QUEUE, (msg) => {
                let data = msg.content.toString();
                logInfo(` [x] worker: ${ACTIVITY_QUEUE} Received ${data} `);
                data = JSON.parse(data);
                processingTask(data.taskId, handleDelivery, (err) => {
                    if (err) {
                        logError(err);
                        requeue(channel, DEFAULT_EXCHANGE_DIRECT, ACTIVITY_QUEUE, msg, (_err) => {
                            if (_err) {
                                logError(_err);
                            }
                            // if (!bool) {
                            //     return channel.reject(msg, false);
                            // }
                        });
                    }
                    channel.ack(msg);
                });
            }, {
                noAck: false
            });
        });
    });
};
