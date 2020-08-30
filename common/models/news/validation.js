/* global __ */
import Joi from 'joi';

export default (News) => {
    News.DEFAULT_MIN_LENGTH = 5;
    News.DEFAULT_MAX_LENGTH = 255;
    News.DEFAULT_MAX_DESC_LENGTH = 500;
    News.validate('viewCount', function (err) {
        if (Joi.number().integer().min(0).required().validate(this.viewCount).error) {
            return err();
        }
    }, {
        message: __('err.news.viewCount')
    });

    News.validate('title', function (err) {
        if (Joi.string().trim().min(News.DEFAULT_MIN_LENGTH).max(News.DEFAULT_MAX_LENGTH).required()
            .validate(this.title).error) {
            return err();
        }
    }, {
        message: __('err.validation.news.title', {
            minLength: News.DEFAULT_MIN_LENGTH,
            maxLength: News.DEFAULT_MAX_LENGTH
        })
    });

    News.validate('description', function (err) {
        if (Joi.string().trim().min(News.DEFAULT_MIN_LENGTH).max(News.DEFAULT_MAX_DESC_LENGTH).optional()
            .validate(this.description).error) {
            return err();
        }
    }, {
        message: __('err.validation.news.description', {
            minLength: News.DEFAULT_MIN_LENGTH,
            maxLength: News.DEFAULT_MAX_DESC_LENGTH
        })
    });

    News.validate('expireOn', function (err) {
        if (Joi.date().iso().min('now').required().validate(this.expireOn).error) {
            return err();
        }
    }, {
        message: __('err.News.expireOn')
    });

    News.validate('userId', function (err) {
        if (Joi.string().hex().length(24).optional().validate(String(this.userId)).error) {
            return err('INVALID');
        }
    }, {
        message: {
            'INVALID': __('err.news.userId')
        }
    });
};
