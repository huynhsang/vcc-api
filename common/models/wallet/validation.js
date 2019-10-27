/* global __ */
import Joi from 'joi';

export default function (Wallet) {
    Wallet.validate('amount', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.amount).error) {
            return err();
        }
    }, {message: __('err.wallet.amount')});

    Wallet.validate('shortId', function (err) {
        if (!this.id && Joi.string().trim().required().validate(String(this.shortId)).error) {
            return err();
        }
    }, {
        message: __('err.wallet.shortId')
    });
};
