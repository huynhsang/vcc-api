import async from 'async';
import Joi from 'joi';
import {MAX_PAGE_SIZE} from '../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (SubCategory) => {
    SubCategory.getTrendingTagsRoute = (filter = {}, callback) => {
        const validateFilter = (next) => {
            const schema = Joi.object().keys({
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(10),
                skip: Joi.number().integer().min(0).default(0)
            });
            schema.validate(filter, {allowUnknown: false}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, params);
            });
        };

        const queryTags = (params, next) => {
            SubCategory.getTrendingTags(params, (err, tags) => {
                if (err) {
                    return next(err);
                }
                next(null, tags);
            });
        };

        async.waterfall([
            validateFilter,
            queryTags
        ], (err, tags) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, tags);
        });
    };

    SubCategory.remoteMethod(
        'getTrendingTagsRoute',
        {
            description: 'Get trending tags',
            returns: {type: 'array', model: 'SubCategory', root: true},
            http: {path: '/trending', verb: 'get'}
        });
};
