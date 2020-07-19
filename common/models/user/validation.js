/* global __ */
import Joi from 'joi';
import {
    USERNAME_REGEX,
    MAX_USERNAME_LENGTH,
    MIN_USERNAME_LENGTH,
    FULLNAME_REGEX,
    PASSWORD_REGEX,
    MIN_LENGTH,
    MAX_LENGTH
} from '../../../configs/constants/validationConstant';
import {validationErrorHandler} from '../../utils/modelHelpers';

export default function (User) {
    User.validate('username', function (err) {
        if (this.username && Joi.string().trim().regex(USERNAME_REGEX)
            .min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).required()
            .validate(this.username).error) {
            return err();
        }
    }, {
        message: __('err.user.username', {
            minLength: MIN_USERNAME_LENGTH,
            maxLength: MAX_USERNAME_LENGTH
        })
    });

    User.validate('firstName', function (err) {
        if (Joi.string().trim().regex(FULLNAME_REGEX).required().validate(this.firstName).error) {
            return err();
        }
    }, {
        message: __('err.user.firstName')
    });

    User.validate('lastName', function (err) {
        if (Joi.string().trim().regex(FULLNAME_REGEX).required().validate(this.lastName).error) {
            return err();
        }
    }, {
        message: __('err.user.lastName')
    });

    /** password is validated before it is hashed **/
    User.on('dataSourceAttached', function () {
        // UPDATE
        User.validatePassword = function (plain) {
            if (typeof plain === 'string' && plain) {
                // must contain number, must contain uppercase and lowercase and min length = 8
                if (!Joi.string().regex(PASSWORD_REGEX).min(MIN_LENGTH)
                    .max(MAX_LENGTH).required().validate(plain).error) {
                    return true;
                }
            }
            throw validationErrorHandler(__('err.user.password'));
        };
    });

    User.validate('points', function (err) {
        if (Joi.number().integer().default(0).validate(this.points).error) {
            return err();
        }
    }, {message: __('err.user.points')});

    User.validateUserById = (userId, callback) => {
        User.findById(userId, {fields: ['id', 'isEnable', 'emailVerified']}, (err, user) => {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error(__('err.user.notExist')));
            }
            if (!user.isEnable || !user.emailVerified) {
                return callback(new Error(__('err.user.notActive')));
            }
            callback();
        });
    };
};

