/* global __ */
import Joi from 'joi';
import {ObjectID} from 'mongodb';
import validationUtils from '../../utils/validationUtils';
import {MAX_BODY_LENGTH, MIN_BODY_LENGTH} from '../../../configs/constants/serverConstant';

export default function (Question) {
    Question.validate('viewCount', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.viewCount).error) {
            return err();
        }
    }, {message: __('err.question.viewCount')});

    Question.validate('answerCount', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.answerCount).error) {
            return err();
        }
    }, {message: __('err.question.answerCount')});

    Question.validate('voteCount', function (err) {
        if (Joi.number().integer().default(0).validate(this.voteCount).error) {
            return err();
        }
    }, {message: __('err.question.voteCount')});

    Question.validate('reportCount', function (err) {
        if (Joi.number().integer().default(0).validate(this.reportCount).error) {
            return err();
        }
    }, {message: __('err.question.reportCount')});

    Question.validate('slug', function (err) {
        if (Joi.string().trim().regex(validationUtils.SLUG_REGEX).required().validate(this.slug).error) {
            return err();
        }
    }, {message: __('err.question.slug')});

    Question.validate('shortId', function (err) {
        if (!this.id && Joi.string().trim().required().validate(String(this.shortId)).error) {
            return err();
        }
    }, {
        message: __('err.question.shortId')
    });

    Question.validate('ownerId', function (err) {
        if (!ObjectID.isValid(this.ownerId)) {
            return err();
        }
    }, {
        message: __('err.question.ownerId')
    });

    Question.validate('body', function (err) {
        if (Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required().validate(this.body).error) {
            return err();
        }
    }, {message: __('err.question.body')});
};

