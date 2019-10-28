import Joi from 'joi';
import async from 'async';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';
import {DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, SORT_QUESTION_CRITERIA} from '../../../configs/constants/serverConstant';

export default function (Question) {
    Question.getQuestionsRoute = (req, filter = {}, callback) => {
        const loggedInUser = req.user;
        const validateQuery = (next) => {
            const schema = Joi.object().keys({
                where: Joi.object().optional(),
                fields: Joi.alternatives().try([Joi.object(), Joi.array().items(Joi.string()), Joi.string()]).optional(),
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                skip: Joi.number().integer().min(0).default(0),
                sort: Joi.string().valid(SORT_QUESTION_CRITERIA).optional()
            }).required();

            Joi.validate(filter, schema, {allowUnknown: false, stripUnknown: true}, (err, params) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                filter = params;
                next();
            });
        };

        const queryQuestions = (next) => {
            Question.getQuestions(loggedInUser, filter, (err, questions) => {
                if (err) {
                    return next(err);
                }
                next(null, questions);
            });
        };

        async.waterfall([
            validateQuery,
            queryQuestions
        ], (err, questions) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, questions);
        });
    };

    /**
     * To Describe API end point to get questions
     */
    Question.remoteMethod(
        'getQuestionsRoute',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {arg: 'filter', type: 'object', description:
                        'Filter defining fields, where, include, sort, offset, and limit - must be a ' +
                        'JSON-encoded string (`{"where":{"something":"value"}}`).  ' +
                        'See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries ' +
                        'for more details.', http: {source: 'query'}}
            ],
            description: 'Find all questions',
            returns: {type: 'array', model: 'Question', root: true},
            http: {path: '/', verb: 'get'}
        }
    );
}
