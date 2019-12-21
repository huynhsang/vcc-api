import _ from 'lodash';
import {logError, logInfo} from '../../common/services/loggerService';
import {DEFAULT_EXCHANGE_DIRECT, DEFAULT_QUEUE} from '../queueConstant';
import {processingTask, requeue} from '../queueUtils';

module.exports = (connection, app) => {
    const handleDelivery = (data, callback) => {
        const routine = _.get(app, data.targetRoutine);
        delete data.targetRoutine;
        if (!routine) {
            return callback('Job targetRoutine missing!');
        }
        const options = data.options;
        delete data.options;
        routine(data, options, callback);
    };

    connection.createChannel((error, channel) => {
        if (error) {
            return logError(error, () => {
                throw error;
            });
        }

        channel.on('error', (err) => {
            logError(`[AMQP] ${DEFAULT_QUEUE} channel error ${err.message}`);
        });

        channel.on('close', () => {
            logInfo(`[AMQP] ${DEFAULT_QUEUE} channel closed`);
        });

        channel.prefetch(10);
        channel.assertQueue(DEFAULT_QUEUE, {
            durable: true
        }, (_error, ok) => {
            if (_error) {
                return logError(_error, () => {
                    throw _error;
                });
            }
            logInfo(` [*] Waiting for messages in ${DEFAULT_QUEUE}`);
            channel.bindQueue(ok.queue, DEFAULT_EXCHANGE_DIRECT, DEFAULT_QUEUE);
            channel.consume(DEFAULT_QUEUE, (msg) => {
                let data = msg.content.toString();
                logInfo(` [x] worker: ${DEFAULT_QUEUE} Received ${data} `);
                data = JSON.parse(data);
                processingTask(data.taskId, handleDelivery, (err) => {
                    if (err) {
                        logError(err);
                        requeue(channel, DEFAULT_EXCHANGE_DIRECT, DEFAULT_QUEUE, msg, (_err) => {
                            if (_err) {
                                logError(_err);
                            }
                            // if (!bool) {
                            //     return channel.nack(msg, false, false);
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
