/* global __ */
import Joi from 'joi';
import {SLUG_PATTERN} from '../../../configs/constants/validationConstant';

export default function (Tag) {
    Tag.validate('slug', function (err) {
        if (Joi.string().trim().regex(SLUG_PATTERN).required().validate(this.slug).error) {
            return err();
        }
    }, {message: __('err.tag.slug')});
};

