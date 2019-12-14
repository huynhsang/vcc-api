import async from 'async';
import Joi from 'joi';
import {FULLNAME_REGEX, MAX_LENGTH, MIN_LENGTH, PASSWORD_REGEX} from '../../../configs/constants/validationConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (User) => {
    User.registerRoute = (formData, callback) => {
        const validateData = (next) => {
            const schema = Joi.object().keys({
                email: Joi.string().trim().email().required(),
                firstName: Joi.string().trim().regex(FULLNAME_REGEX).required(),
                lastName: Joi.string().trim().regex(FULLNAME_REGEX).required(),
                password: Joi.string().regex(PASSWORD_REGEX).min(MIN_LENGTH).max(MAX_LENGTH).required()
            });

            schema.validate(formData, {allowUnknown: true, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                formData = value;
                next();
            });
        };

        async.waterfall([
            validateData,
            (next) => {
                User.register(formData, next);
            }
        ], (err, user) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, user);
        });
    };

    User.remoteMethod('registerRoute', {
        accessType: 'WRITE',
        accepts: [
            {
                arg: 'data', type: 'object', model: 'user',
                http: {source: 'body'}, required: true,
                description: 'Model instance data'
            }
        ],
        description: 'Register a new user and persist it into the data source.',
        returns: {type: 'object', model: 'user', root: true},
        http: [{path: '/register', verb: 'post'}]
    });
};
