import _ from 'lodash';
import async from 'async';
import amqp from 'amqplib/callback_api';
import path from 'path';
import fs from 'fs';
import config from '../configs/global/config.global';
import {logError, logInfo} from '../common/services/loggerService';
import {DEFAULT_EXCHANGES} from './queueConstant';

let queueConnection;

const initExchanges = (callback) => {
    queueConnection.createConfirmChannel((err, channel) => {
        if (err) {
            return callback(err);
        }
        const queue = async.queue((exchange, cb) => {
            try {
                channel.assertExchange(exchange.name, 'x-delayed-message', {
                    autoDelete: false,
                    durable: true,
                    passive: true,
                    arguments: {'x-delayed-type': exchange.type}
                });
                cb();
            } catch (e) {
                cb(e);
            }
        }, DEFAULT_EXCHANGES.length);

        let queueErr;

        // assign a callback
        queue.drain(() => {
            if (queueErr) {
                return callback(queueErr);
            }
            channel.close(() => {
                callback();
            });
        });

        // assign an error callback
        queue.error((_err) => {
            channel.close(() => {
                callback(_err);
            });
        });

        _.forEach(DEFAULT_EXCHANGES, (exchange) => {
            queue.push(exchange, (_err) => {
                if (_err && !queueErr) {
                    queueErr = _err;
                }
            });
        });
    });
};

const loadConsumers = (app) => {
    const consumersPath = path.join(__dirname, '/consumers');
    fs.readdirSync(consumersPath).forEach((file) => {
        const consumer = require(`./consumers/${file}`);
        consumer(queueConnection, app);
    });
};

export const initQueue = (app, callback) => {
    amqp.connect(config.QUEUE_URL, (err, connection) => {
        if (err) {
            return logError(`[AMQP] ${err.message}`, () => {
                callback(err);
            });
        }
        connection.on('error', (_err) => {
            if (_err.message !== 'Connection closing') {
                logError(`[AMQP] connection error ${_err.message}`);
            }
        });

        connection.on('close', () => {
            logInfo('[AMQP] connection closed');
        });

        logInfo('[AMQP] connected');

        queueConnection = connection;
        initExchanges((_err) => {
            if (_err) {
                return logError(_err, () => {
                    callback(_err);
                });
            }
            loadConsumers(app);
            callback(null, connection);
        });
    });
};

export const closeOnError = (err) => {
    if (!err) return false;
    if (!_.isObject(err)) {
        err = new Error(err);
    }
    logError(`[AMQP] error ${err.message}`);
    queueConnection.close();
    return true;
};

export const getConnection = () => {
    return queueConnection;
};
