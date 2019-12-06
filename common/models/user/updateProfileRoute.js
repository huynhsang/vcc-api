/* global __ */;
import _ from 'lodash';
import async from 'async';
import Joi from 'joi';
import {errorHandler, permissionErrorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (User) => {
    User.updateProfileRoute = (data, req, callback) => {
        const user = req.user;
        if (!user) {
            return callback(permissionErrorHandler(__('err.user.NotExists')));
        }

        const validateData = (next) => {
            const schema = Joi.object().keys({
                firstName: Joi.string().trim().optional(),
                lastName: Joi.string().trim().optional(),
                headline: Joi.string().trim().optional(),
                nationality: Joi.string().trim().optional(),
                summary: Joi.string().trim().optional(),
                dateOfBirth: Joi.date().iso().optional()
            }).required();

            schema.validate(data, {allowUnknown: true, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                data = value;
                next();
            });
        };

        const handleUpdate = (next) => {
            const payload = _.pick(['firstName', 'lastName', 'headline', 'nationality', 'summary', 'dateOfBirth']);
            if (Object.keys(payload).length === 0) {
                return next(null, user);
            }
            user.updateAttributes(payload, next);
        };

        async.waterfall([
            validateData,
            handleUpdate
        ], (err, _user) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, _user.toObject(true, true, true));
        });
    };

    User.remoteMethod('updateProfileRoute', {
        accessType: 'WRITE',
        accepts: [
            {
                arg: 'data', type: 'object', model: 'User',
                http: {source: 'body'}, required: true,
                description: 'An object of model property name/value pairs'
            },
            {
                arg: 'req', type: 'object', http: {source: 'req'}
            }
        ],
        description: 'Patch attributes for a model instance and persist it into the data source.',
        returns: {type: 'object', model: 'user', root: true},
        http: [{path: '/', verb: 'patch'}, {path: '/', verb: 'put'}]
    });
};
