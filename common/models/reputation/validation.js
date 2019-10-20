/* global __ */
import Joi from 'joi';
import ObjectID from 'mongodb';
import {REPUTATION_MODEL_TYPES, REPUTATION_TYPES} from '../../../configs/constants/serverConstant';

export default function (Reputation) {
    Reputation.validate('point', function (err) {
        if (Joi.number().integer().required().validate(this.point).error) {
            return err();
        }
    }, {message: __('err.validation.reputation.point')});

    Reputation.validate('giverId', function (err) {
        if (!ObjectID.isValid(this.giverId)) {
            return err();
        }
    }, {message: __('err.reputation.giverId')});

    Reputation.validate('receiverId', function (err) {
        if (!ObjectID.isValid(this.receiverId)) {
            return err();
        }
    }, {message: __('err.reputation.receiverId')});

    Reputation.validate('modelId', function (err) {
        if (!ObjectID.isValid(this.modelId)) {
            return err();
        }
    }, {message: __('err.reputation.modelId')});

    Reputation.validate('modelType', function (err) {
        if (Joi.string().required().valid(REPUTATION_MODEL_TYPES).validate(this.modelType).error) {
            return err();
        }
    }, {message: __('err.reputation.modelType')});

    Reputation.validate('type', function (err) {
        if (Joi.string().required().valid(REPUTATION_TYPES).validate(this.type).error) {
            return err();
        }
    }, {message: __('err.reputation.type')});
};
