/* global __*/
import Joi from 'joi';
import {ObjectID} from 'mongodb';
import {VOTE_ACTIONS, VOTE_TYPES} from '../../../configs/constants/serverConstant';

module.exports = function (Vote) {
    Vote.validate('ownerId', function (err) {
        if (!ObjectID.isValid(this.ownerId)) {
            return err();
        }
    }, {message: __('err.vote.ownerId')});

    Vote.validate('modelId', function (err) {
        if (!ObjectID.isValid(this.modelId)) {
            return err();
        }
    }, {message: __('err.vote.modelId')});

    Vote.validate('modelType', function (err) {
        if (Joi.string().trim().required().valid(VOTE_TYPES).validate(this.modelType).error) {
            return err();
        }
    }, {message: __('err.vote.modelType')});

    Vote.validate('action', function (err) {
        if (Joi.string().trim().required().valid(VOTE_ACTIONS).validate(this.action).error) {
            return err();
        }
    }, {message: __('err.vote.action')});
};
