/* global __ */
import _ from 'lodash';
import {
    ACCESS_DENIED,
    PERMISSION_DENIED,
    RESOURCE_NOT_FOUND,
    VALIDATION_ERROR
} from '../../configs/constants/errorCodes';
import {BAD_REQUEST, FORBIDDEN, NOT_FOUND, UNAUTHORIZED} from '../../configs/constants/httpStatuses';

const createError = function (message, code, httpStatus) {
    const err = new Error(message);
    err.statusCode = httpStatus || BAD_REQUEST;
    err.code = code || VALIDATION_ERROR;
    return err;
};

const errorHandler = function (message, code, httpStatus) {
    let details = [];
    if (_.isString(message)) {
        details.push(message);
    }
    if (!httpStatus) {
        httpStatus = BAD_REQUEST;
    }
    if (!code) {
        code = VALIDATION_ERROR;
    }
    if (message instanceof Error) {
        message.statusCode = message.statusCode || httpStatus;
        message.code = message.code || code;
        return message;
    }
    if (_.isObject(message) && (message.constructor.name === 'ValidationError')) {
        if (message.isJoi) {
            for (const m of message.details) {
                if (_.isObject(m)) {
                    details.push(__(message.prefix + '.' + m.message));
                } else {
                    details.push(__(message.prefix + '.' + String(m)));
                }
            }
        } else {
            const keys = _.keys(message.details.messages);
            for (const k of keys) {
                if (_.isArray(message.details.messages[k])) {
                    details = _.union(details, message.details.messages[k]);
                } else {
                    details.push(String(message.details.messages[k]));
                }
            }
            details = details.map((m) => (__(m)));
        }
    }
    if (_.isObject(message) && (message.constructor.name === 'Errors')) {
        const reasons = _.values(message)[0];
        if (typeof reasons === 'string') {
            details.push(reasons);
        } else {
            details = details.concat(reasons);
        }
    }
    const errMessage = (details.length > 0) ? details[details.length - 1] : __('errorCode.' + code);
    const err = new Error(errMessage);
    err.statusCode = httpStatus;
    err.code = code;
    err.details = details;
    return err;
};
export {createError, errorHandler};

export function accessDeniedErrorHandler (message) {
    message = (message) ? message : __('errorCode.' + ACCESS_DENIED);
    return errorHandler(message, ACCESS_DENIED, UNAUTHORIZED);
}

export function permissionErrorHandler (message) {
    message = (message) ? message : __('errorCode.' + PERMISSION_DENIED);
    return errorHandler(message, PERMISSION_DENIED, FORBIDDEN);
}

export function validationErrorHandler (message) {
    message = (message) ? message : __('errorCode.' + VALIDATION_ERROR);
    return errorHandler(message, VALIDATION_ERROR, BAD_REQUEST);
}

export function notFoundErrorHandler (message) {
    message = (message) ? message : __('errorCode.' + RESOURCE_NOT_FOUND);
    return errorHandler(message, RESOURCE_NOT_FOUND, NOT_FOUND);
}
