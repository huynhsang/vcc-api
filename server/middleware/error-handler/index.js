import * as _ from 'lodash';
import {logError} from '../../../common/services/loggerService';
import config from '../../../configs/global/config.global';

const handleError = () => {
    return (err, req, res, next) => {
        console.log('haha');
        if (!_.isObject(err)) {
            err = new Error(err);
        }
        const errLog = JSON.parse(JSON.stringify(err));
        errLog.message = err.message;
        errLog.stack = err.stack;
        if (!config.DEBUG) {
            delete err.stack;
            delete errLog.stack;
        }
        const userAgent = req.headers['user-agent'];
        const ip = (req.headers['HTTP_CF_CONNECTING_IP'] ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || null);
        errLog.metadata = {
            userAgent,
            ip,
            referrer: req.headers && req.headers.referrer,
            endpoint: req.url,
            userId: null
        };

        logError(errLog, () => {
            next(err);
        });
    };
};

export default handleError;
