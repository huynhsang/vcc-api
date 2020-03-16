import Joi from 'joi';
import async from 'async';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import {DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, SORT_QUESTION_CRITERIA} from '../../../../configs/constants/serverConstant';

export default function (Question) {
    Question._GetQuestions = (req, filter = {}, totalCount, callback) => {
        const loggedInUser = req.user;

        const validateQuery = (next) => {
            const query = {filter, totalCount};
            const schema = Joi.object().keys({
                filter: Joi.object().keys({
                    keyword: Joi.string().trim().optional(),
                    tagIds: Joi.array().items(Joi.string()).optional(),
                    limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                    skip: Joi.number().integer().min(0).default(0),
                    sort: Joi.string().valid(SORT_QUESTION_CRITERIA).optional(),
                    ownerId: Joi.string().hex().length(24).optional(),
                    categorySlug: Joi.string().optional()
                }).optional(),
                totalCount: Joi.bool().default(false)
            }).required();

            Joi.validate(query, schema, {allowUnknown: true, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, value);
            });
        };

        const queryQuestions = (validQuery, next) => {
            Question.getQuestions(validQuery.filter, {totalCount: validQuery.totalCount}, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (!loggedInUser) {
                    return next(null, result);
                }
                Question.personalise(loggedInUser.id, result.questions, (_err, questions) => {
                    if (_err) {
                        return next(_err);
                    }
                    result.questions = questions;
                    next(null, result);
                });
            });
        };

        async.waterfall([
            validateQuery,
            queryQuestions
        ], (err, result) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, result);
        });
    };

    Question.afterRemote('_GetQuestions', (ctx, data, next) => {
        if (data) {
            if (typeof data.totalCount !== 'undefined') {
                ctx.res.set('Access-Control-Expose-Headers', 'x-total-count');
                ctx.res.set('X-Total-Count', data.totalCount);
            }
            ctx.result = data.questions || [];
        }
        next();
    });

    /**
     * To Describe API end point to get questions
     */
    Question.remoteMethod(
        '_GetQuestions',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'req', type: 'object', http: {source: 'req'}},
                {
                    arg: 'filter', type: 'object', description:
                        'Filter defining fields, where, include, sort, offset, and limit - must be a ' +
                        'JSON-encoded string (`{"where":{"something":"value"}}`).  ' +
                        'See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries ' +
                        'for more details.', http: {source: 'query'}
                },
                {arg: 'totalCount', type: 'boolean', http: {source: 'query'}}
            ],
            description: 'Find all questions',
            returns: {type: 'array', model: 'Question', root: true},
            http: {path: '/', verb: 'get'}
        }
    );
}
