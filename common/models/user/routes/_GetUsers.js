import Joi from 'joi';
import {ADMIN_REALM, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, SORT_USERS_CRITERIA} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import async from 'async';
import {getOrder} from '../utils/helpers';

export default (User) => {
    User._GetUsers = (filter = {}, callback) => {
        const validateFilter = (next) => {
            const schema = Joi.object().keys({
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                skip: Joi.number().integer().min(0).default(0),
                sort: Joi.string().valid(SORT_USERS_CRITERIA).optional()
            });
            schema.validate(filter, {allowUnknown: false}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, params);
            });
        };

        const queryUsers = (params, next) => {
            User.find({
                where: {
                    realm: {
                        neq: ADMIN_REALM
                    },
                    emailVerified: true,
                    isEnable: true
                },
                limit: params.limit,
                skip: params.skip,
                order: getOrder(params.sort)
            }, next);
        };

        async.waterfall([
            validateFilter,
            queryUsers
        ], (err, users) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, users);
        });
    };

    User.remoteMethod(
        '_GetUsers',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'filter', type: 'object', http: {source: 'query'}}
            ],
            description: 'Find all instances of the model matched by filter from the data source',
            returns: {type: 'array', model: 'user', root: true},
            http: {path: '/', verb: 'get'}
        }
    );
}