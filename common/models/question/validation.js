/* global __ */
import Joi from 'joi';
import {ObjectID} from 'mongodb';
import validationUtils from '../../utils/validationUtils';
import {MAX_BODY_LENGTH, MIN_BODY_LENGTH} from '../../../configs/constants/serverConstant';

export default function (Question) {
    Question.validate('viewsCount', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.viewsCount).error) {
            return err();
        }
    }, {message: __('err.question.viewsCount')});

    Question.validate('answersCount', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.answersCount).error) {
            return err();
        }
    }, {message: __('err.question.answersCount')});

    Question.validate('votesCount', function (err) {
        if (Joi.number().integer().default(0).validate(this.votesCount).error) {
            return err();
        }
    }, {message: __('err.question.votesCount')});

    Question.validate('reportsCount', function (err) {
        if (Joi.number().integer().default(0).validate(this.reportsCount).error) {
            return err();
        }
    }, {message: __('err.question.reportsCount')});

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

