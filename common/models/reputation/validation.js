/* global __ */
import Joi from 'joi';

export default function (Reputation) {
    Reputation.validate('point', function (err) {
        if (Joi.number().integer().required().validate(this.point).error) {
            return err();
        }
    }, {message: __('err.validation.reputation.point')});
};
