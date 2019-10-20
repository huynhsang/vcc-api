import async from 'async';
import Joi from 'joi';
import {MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE} from '../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default function (Question) {
    /**
     * The method will call the service to get answers by question Id
     *
     * @param req: {Object} The request
     * @param id {Number} The question Id
     * @param filter {Object} Optional Filter JSON object.
     * @param callback {Function} Callback function.
     */
    Question.getAnswers = (id, req, filter = {}, callback) => {
        const loggedInUser = req.user;

        const validateQuery = (next) => {
            const query = {id, filter};
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                filter: Joi.object().keys({
                    where: Joi.object().optional(),
                    fields: Joi.alternatives().try([Joi.object(), Joi.array().items(Joi.string()), Joi.string()]).optional(),
                    limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                    skip: Joi.number().integer().min(0).default(0),
                    order: Joi.alternatives().try([Joi.string(), Joi.array()]).optional()
                }).optional()
            }).required();

            Joi.validate(query, schema, {allowUnknown: false, stripUnknown: true}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                filter = params.filter;
                next();
            });
        };

        const queryAnswers = (next) => {
            Question.app.models.Answer.getAnswersByQuestion(id, loggedInUser, filter, (err, answers) => {
                if (err) {
                    return next(err);
                }
                next(null, answers);
            });
        };

        async.waterfall([
            validateQuery,
            queryAnswers
        ], (err, answers) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answers);
        });
    };

    /**
     * To Describe API end point to get answers by question Id
     */
    Question.remoteMethod(
        'getAnswers',
        {
            accepts: [
                {arg: 'id', type: 'number', description: 'Question Id', http: {source: 'path'}},
                {arg: 'data', type: 'object', http: {source: 'req'}},
                {arg: 'filter', type: 'object', description:
                        'Filter defining fields, where, include, order, offset, and limit - must be a ' +
                        'JSON-encoded string (`{"where":{"something":"value"}}`).  ' +
                        'See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries ' +
                        'for more details.', http: {source: 'query'}}
            ],
            description: 'Find all Answers By question Id',
            returns: {type: 'array', model: 'Answer', root: true},
            http: {path: '/:id/answers', verb: 'get'}
        }
    );
}
