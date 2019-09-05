/* global __ */
import Joi from 'joi';
import validationUtils from '../../utils/validationUtils';
import {validationErrorHandler} from '../../utils/modelHelpers';

export default function (User) {
    User.validate('username', function (err) {
        if (Joi.string().trim().regex(validationUtils.USERNAME_REGEX).min(validationUtils.MIN_USERNAME_LENGTH)
            .max(validationUtils.MAX_USERNAME_LENGTH).required().validate(this.username).error) {
            return err();
        }
        this.username = this.username.trim();
    }, {
        message: __('err.validation.user.username', {
            minLength: validationUtils.MIN_USERNAME_LENGTH,
            maxLength: validationUtils.MAX_USERNAME_LENGTH
        })
    });

    User.validate('firstName', function (err) {
        if (Joi.string().trim().regex(validationUtils.FULLNAME_REGEX).required().validate(this.firstName).error) {
            return err();
        }
    }, {
        message: __('err.validation.user.firstName')
    });

    User.validate('lastName', function (err) {
        if (Joi.string().trim().regex(validationUtils.FULLNAME_REGEX).required().validate(this.lastName).error) {
            return err();
        }
    }, {
        message: __('err.validation.user.lastName')
    });

    /** password is validated before it is hashed **/
    User.on('dataSourceAttached', function () {
        // UPDATE
        User.validatePassword = function (plain) {
            if (typeof plain === 'string' && plain) {
                // must contain number, must contain uppercase and lowercase and min length = 8
                if (!Joi.string().regex(validationUtils.PASSWORD_REGEX).min(validationUtils.MIN_LENGTH)
                    .max(validationUtils.MAX_LENGTH).required().validate(plain).error) {
                    return true;
                }
            }
            throw validationErrorHandler(__('err.validation.user.password'));
        };
    });

    User.validate('points', function (err) {
        if (Joi.number().integer().default(0).validate(this.points).error) {
            return err();
        }
    }, {message: __('err.validation.user.points')});
};

