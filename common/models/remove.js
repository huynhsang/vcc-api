/* global __*/
import Joi from 'joi';
import {ObjectID} from 'mongodb';

module.exports = function (Remove) {
    Remove.validate('reason', function (err) {
        if (Joi.string().trim().required().validate(this.reason).error) {
            return err();
        }
    }, {
        message: __('err.remove.invalidReason')
    });
    Remove.validate('removedUserId', function (err) {
        if (!ObjectID.isValid(this.removedUserId)) {
            return err();
        }
    }, {message: __('err.remove.removedUserId')});

    Remove.validate('removedDate', function (err) {
        if (Joi.date().iso().required().validate(this.removedDate).error) {
            return err();
        }
    }, {message: __('err.remove.removedDate')});
};
