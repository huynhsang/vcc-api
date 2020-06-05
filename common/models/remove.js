/* global __*/
import Joi from 'joi';
import {ObjectID} from 'mongodb';

module.exports = function (Remove) {
    Remove.validate('reason', function (err) {
        if (Joi.string().trim().optional().validate(this.reason).error) {
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

    Remove.validate('removedOn', function (err) {
        if (Joi.date().iso().required().validate(this.removedOn).error) {
            return err();
        }
    }, {message: __('err.remove.removedOn')});
};
