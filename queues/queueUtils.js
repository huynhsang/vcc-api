import {logInfo} from '../common/services/loggerService';

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
