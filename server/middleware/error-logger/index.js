import {logError} from '../../../common/services/loggerService';

module.exports = function () {
    return function handleError (err, req, res, next) {
        logError(err);
        next(err);
    };
};
