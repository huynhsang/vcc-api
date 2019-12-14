/* global __ */
import Joi from 'joi';
import {SLUG_REGEX} from '../../../configs/constants/validationConstant';

export default function (Tag) {
    Tag.validate('slug', function (err) {
        if (Joi.string().trim().regex(SLUG_REGEX).required().validate(this.slug).error) {
            return err();
        }
    }, {message: __('err.tag.slug')});
};

