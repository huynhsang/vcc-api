import * as _ from 'lodash';
import logger from '../../configs/logger';
import config from '../../configs/global/config.global';

export const logError = (err, callback) => {
    if (!_.isObject(err)) {
        err = new Error(err);
    }
    if (!err || !err.message) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    const metadata = err.metadata || {};
    if (config.DEBUG) {
        metadata['stack'] = err.stack;
    }
    metadata['code'] = err.code;
    metadata['statusCode'] = err.statusCode;
    logger.error(err.message, metadata);
    process.nextTick(() => {
        callback();
    });
};

export const logInfo = (message) => {
    logger.info(message);
};
