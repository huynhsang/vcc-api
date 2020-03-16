import async from 'async';
import Joi from 'joi';
import {DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default (Category) => {
    Category.getTagsRoute = (slug, req, filter = {}, callback) => {
        const validateParams = (next) => {
            const schema = Joi.object().keys({
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                skip: Joi.number().integer().min(0).default(0)
            }).optional();
            schema.validate(filter, {allowUnknown: false}, (err, value) => {
                if (err) {
                    validationErrorHandler(err);
                }
                next(null, value);
            });
        };

        const queryTags = (validFilter, next) => {
            Category.getTagsByCategory(slug, validFilter, (err, tags) => {
                if (err) {
                    return next(err);
                }
                next(null, tags);
            });
        };

        async.waterfall([
            validateParams,
            queryTags
        ], (err, tags) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, tags);
        });
    };

    Category.remoteMethod(
        'getTagsRoute',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'slug', type: 'string', description: 'Category slug', http: {source: 'path'}},
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'filter', type: 'object', http: {source: 'query'}}
            ],
            description: 'Find all instances of the tags matched by category slug',
            returns: {type: 'array', model: 'Tag', root: true},
            http: {path: '/:slug/tags', verb: 'get'}
        }
    );
};
