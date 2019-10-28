import async from 'async';
import Joi from 'joi';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';
import {SLUG_PATTERN} from '../../../configs/constants/validationConstant';

export default function (Question) {
    /**
     * The method will call the service to get question detail
     *
     * @param slug {String} The question slug
     * @param req: {Object} The request
     * @param filter: {Object} The filter
     * @param callback {Function} Callback function.
     */
    Question.getDetailBySlugRoute = (slug, req, filter = {}, callback) => {
        const loggedInUser = req.user;
        const validateParams = (next) => {
            const query = {slug, filter};
            const schema = Joi.object().keys({
                'slug': Joi.string().regex(SLUG_PATTERN).required(),
                'filter': Joi.object().keys({
                    'where': Joi.object().optional(),
                    'fields': Joi.alternatives().try([Joi.object(), Joi.array().items(Joi.string()), Joi.string()]).optional()
                }).optional()
            }).required();

            schema.validate(query, {allowUnknown: false, stripUnknown: true}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, params);
            });
        };

        const getQuestion = (params, next) => {
            Question.getQuestionBySlug(params.slug, loggedInUser, params.filter, (err, question) => {
                if (err) {
                    return next(err);
                }
                next(null, question);
            });
        };

        async.waterfall([
            validateParams,
            getQuestion
        ], (err, question) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, question);
        });
    };

    /**
     * To Describe API end point to get questions
     */
    Question.remoteMethod(
        'getDetailBySlugRoute',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'slug', type: 'string', description: 'Question slug', http: {source: 'path'}},
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'filter', type: 'object', description:
                        'Filter defining fields, where - must be a JSON-encoded string (`{"where":{"something":"value"}}`).  ' +
                        'See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries for more details.',
                    http: {source: 'query'}
                }
            ],
            description: 'Get question detail by Slug',
            returns: {type: 'object', model: 'Question', root: true},
            http: {path: '/:slug', verb: 'get'}
        }
    );
}
