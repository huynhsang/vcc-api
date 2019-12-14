import {DEFAULT_EXCHANGE_DIRECT, DEFAULT_QUEUE_DELAY, DEFAULT_QUEUE_ATTEMPTS, SEND_MAIL_QUEUE} from '../queueConstant';

export default {
    SEND_MAIL_TASK: (params) => (
        {
            // payload: type, to, subject, html
            title: `SendMailTask to: ${params.to}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: SEND_MAIL_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: 0
        }
    )
};
