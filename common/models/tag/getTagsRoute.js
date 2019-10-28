import async from 'async';
import Joi from 'joi';
import {DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, SORT_TAGS_CRITERIA} from '../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (Tag) => {
    Tag.getTagsRoute = (req, filter = {}, callback) => {
        const validateFilter = (next) => {
            const schema = Joi.object().keys({
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                skip: Joi.number().integer().min(0).default(0),
                sort: Joi.string().valid(SORT_TAGS_CRITERIA).optional()
            });
            schema.validate(filter, {allowUnknown: false}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, params);
            });
        };

        const queryTags = (params, next) => {
            Tag.getTags(params, (err, tags) => {
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

    Tag.remoteMethod(
        'getTagsRoute',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'data', type: 'object', http: {source: 'req'}},
                {arg: 'filter', type: 'object', http: {source: 'query'}}
            ],
            description: 'Find all instances of the model matched by filter from the data source',
            returns: {type: 'array', model: 'Tag', root: true},
            http: {path: '/', verb: 'get'}
        }
    );
};
