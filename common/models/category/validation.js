/* global __ */
import Joi from 'joi';
import validationUtils from '../../utils/validationUtils';

export default function (Category) {
    Category.validate('slug', function (err) {
        if (Joi.string().trim().regex(validationUtils.SLUG_REGEX).required().validate(this.slug).error) {
            return err();
        }
    }, {message: __('err.category.slug')});
};

