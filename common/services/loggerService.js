import * as _ from 'lodash';
import logger from '../../configs/logger/logger';

export function logError (err, callback) {
    if (!_.isObject(err)) {
        err = new Error(err);
    }
    if (!err || !err.message) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    const metaData = err.metaData || {};
    metaData['stack'] = err.stack;
    metaData['code'] = err.code;
    metaData['statusCode'] = err.statusCode;
    logger.error(err.message, metaData, callback);
}

export function logInfo (message) {
    logger.info(message);
}
