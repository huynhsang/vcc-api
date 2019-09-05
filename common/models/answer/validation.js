/* global __ */
import Joi from 'joi';

export default function (Answer) {
    Answer.validate('numberOfVotes', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.numberOfVotes).error) {
            return err();
        }
    }, {message: __('err.validation.answer.numberOfVotes')});

    Answer.validate('shortId', function (err) {
        if (!this.id && Joi.string().trim().required().validate(String(this.shortId)).error) {
            return err();
        }
    }, {
        message: __('err.validation.invalidShortId')
    });
};
