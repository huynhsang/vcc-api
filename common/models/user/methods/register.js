import Joi from 'joi';
import {
    FULLNAME_REGEX,
    MAX_LENGTH, MAX_USERNAME_LENGTH,
    MIN_LENGTH,
    MIN_USERNAME_LENGTH,
    PASSWORD_REGEX,
    USERNAME_REGEX
} from '../../../../configs/constants/validationConstant';
import {validationErrorHandler} from '../../../utils/modelHelpers';

export default (User) => {
    User.register = (data, callback) => {
        const validateRequestData = (next) => {
            const schema = Joi.object().keys({
                email: Joi.string().trim().email().required(),
                firstName: Joi.string().trim().regex(FULLNAME_REGEX).min(1).max(MAX_LENGTH).required(),
                lastName: Joi.string().trim().regex(FULLNAME_REGEX).min(1).max(MAX_LENGTH).required(),
                password: Joi.string().regex(PASSWORD_REGEX).min(MIN_LENGTH).max(MAX_LENGTH).required(),
                username: Joi.string().trim().string().trim().regex(USERNAME_REGEX).min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH)
            });

            schema.validate(data, {allowUnknown: true, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                data = value;
                next();
            });
        };

        const
    };
};
