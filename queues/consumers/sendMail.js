/* global __*/
import async from 'async';
import path from 'path';
import config from '../../configs/global/config.global';
import emailService from '../../common/services/emailService';
import {logError, logInfo} from '../../common/services/loggerService';
import {VERIFICATION_EMAIL} from '../../configs/constants/serverConstant';
import {DEFAULT_EXCHANGE_DIRECT, SEND_MAIL_QUEUE} from '../queueConstant';

module.exports = (connection, app) => {
    const handleDelivery = (data, callback) => {
        const sendVerificationEmail = (cb) => {
            const getUser = (next) => {
                app.models.user.findOne({
                    where: {
                        email: data.to
                    }
                }, (err, user) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(new Error(__('err.user.notExists')));
                    }
                    if (user.emailVerified) {
                        return next(new Error(__('err.user.emailVerified')));
                    }
                    next(null, user);
                });
            };

            const handleSendMail = (user, next) => {
                const options = {
                    type: 'email',
                    to: user.email,
                    from: config.SENDER_EMAIL,
                    subject: __('account.verification.emailSubject'),
                    template: path.resolve(__dirname, '../../server/views/emailVerificationTemplate.ejs'),
                    redirect: null,
                    host: config.SERVER_ADDRESS,
                    user,
                    protocol: config.SERVER_PROTOCOL,
                    port: config.SERVER_PORT
                };
                user.verify(options, next);
            };

            async.waterfall([getUser, handleSendMail], cb);
        };

        if (data.type === VERIFICATION_EMAIL) {
            return sendVerificationEmail(callback);
        }

        emailService.send(data, callback);
    };

    connection.createChannel((error, channel) => {
        if (error) {
            return logError(error, () => {
                throw error;
            });
        }

        channel.on('error', (err) => {
            logError(`[AMQP] ${SEND_MAIL_QUEUE} channel error ${err.message}`);
        });

        channel.on('close', () => {
            logInfo(`[AMQP] ${SEND_MAIL_QUEUE} channel closed`);
        });

        channel.prefetch(10);
        channel.assertQueue(SEND_MAIL_QUEUE, {
            durable: true
        }, (err, ok) => {
            if (err) {
                return logError(err, () => {
                    throw err;
                });
            }
            logInfo(` [*] Waiting for messages in ${SEND_MAIL_QUEUE}`);
            channel.bindQueue(ok.queue, DEFAULT_EXCHANGE_DIRECT, SEND_MAIL_QUEUE);
            channel.consume(SEND_MAIL_QUEUE, (msg) => {
                const content = msg.content.toString();
                logInfo(` [x] worker: ${SEND_MAIL_QUEUE} Received ${content} `);
                handleDelivery(JSON.parse(content), (_err) => {
                    if (_err) {
                        // const attempts = msg.properties.headers['x-retry-count'] || 0;
                        // msg.properties.headers['x-retry-count'] = attempts - 1;
                        logError(_err);
                    }
                    channel.ack(msg);
                });
            }, {
                noAck: false
            });
        });
    });
};
