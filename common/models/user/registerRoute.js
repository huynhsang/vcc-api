import Joi from 'joi';
import {
    FULLNAME_REGEX,
    MAX_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_LENGTH,
    MIN_USERNAME_LENGTH,
    PASSWORD_REGEX,
    USERNAME_REGEX
} from '../../../configs/constants/validationConstant';
import {validationErrorHandler} from '../../utils/modelHelpers';

export default (User) => {
    User.registerRoute = (body, callback) => {


    };
};
