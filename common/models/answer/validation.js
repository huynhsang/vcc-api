/* global __ */
import Joi from 'joi';
import {ObjectID} from 'mongodb';
import {MAX_BODY_LENGTH, MIN_BODY_LENGTH} from '../../../configs/constants/serverConstant';

export default function (Answer) {
    Answer.validate('votesCount', function (err) {
        if (Joi.number().integer().default(0).validate(this.votesCount).error) {
            return err();
        }
    }, {message: __('err.answer.votesCount')});

    Answer.validate('shortId', function (err) {
        if (!this.id && Joi.string().trim().required().validate(String(this.shortId)).error) {
            return err();
        }
    }, {
        message: __('err.answer.shortId')
    });

    Answer.validate('body', function (err) {
        if (Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required().validate(this.body).error) {
            return err();
        }
    }, {message: __('err.answer.body')});

    Answer.validate('ownerId', function (err) {
        if (!ObjectID.isValid(this.ownerId)) {
            return err();
        }
    }, {
        message: __('err.Answer.ownerId')
    });

    Answer.validate('questionId', function (err) {
        if (!ObjectID.isValid(this.questionId)) {
            return err();
        }
    }, {
        message: __('err.Answer.questionId')
    });
};
