/* global __ */
import Joi from 'joi';
import validationUtils from '../../utils/validationUtils';

export default function (Question) {
    Question.validate('numberOfAndroidViews', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.numberOfAndroidViews).error) {
            return err();
        }
    }, {message: __('err.validation.question.numberOfAndroidViews')});

    Question.validate('numberOfIosViews', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.numberOfIosViews).error) {
            return err();
        }
    }, {message: __('err.validation.question.numberOfIosViews')});

    Question.validate('numberOfViews', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.numberOfViews).error) {
            return err();
        }
    }, {message: __('err.validation.question.numberOfViews')});

    Question.validate('numberOfAnswers', function (err) {
        if (Joi.number().integer().min(0).default(0).validate(this.numberOfAnswers).error) {
            return err();
        }
    }, {message: __('err.validation.question.numberOfAnswers')});

    Question.validate('numberOfVotes', function (err) {
        if (Joi.number().integer().default(0).validate(this.numberOfVotes).error) {
            return err();
        }
    }, {message: __('err.validation.question.numberOfVotes')});

    Question.validate('slug', function (err) {
        if (Joi.string().trim().regex(validationUtils.SLUG_REGEX).required().validate(this.slug).error) {
            return err();
        }
    }, {message: __('err.validation.question.slug')});

    Question.validate('categorySlug', function (err) {
        if (Joi.string().trim().regex(validationUtils.SLUG_REGEX).required().validate(this.categorySlug).error) {
            return err();
        }
    }, {message: __('err.validation.question.categorySlug')});

    Question.validate('shortId', function (err) {
        if (!this.id && Joi.string().trim().required().validate(String(this.shortId)).error) {
            return err();
        }
    }, {
        message: __('err.validation.invalidShortId')
    });
};

