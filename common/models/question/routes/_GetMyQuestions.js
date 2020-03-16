import async from 'async';
import Joi from 'joi';
import {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    SORT_QUESTION_CRITERIA
} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import {getQuestionConds, getQuestionOrder} from '../utils/helper';

export default (Question) => {
    Question._GetMyQuestions = (filter = {}, options, req, callback) => {
        const currentUser = req.user || {};
        options = options || {};

        const validateQuery = (next) => {
            const schema = Joi.object().keys({
                keyword: Joi.string().trim().optional(),
                tagIds: Joi.array().items(Joi.string()).optional(),
                limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                skip: Joi.number().integer().min(0).default(0),
                sort: Joi.string().valid(SORT_QUESTION_CRITERIA).optional(),
                category: Joi.string().optional()
            });

            schema.validate(filter, {allowUnknown: true, stripUnknown: true}, (err, value) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next(null, value);
            });
        };

        const queryQuestions = (query, next) => {
            query.ownerId = currentUser.id;
            const conds = getQuestionConds(query);
            async.parallel({
                'totalCount': (cb) => {
                    if (!options.totalCount) {
                        return cb(null, -1);
                    }
                    Question.count(conds, cb);
                },
                'questions': (cb) => {
                    const _filter = {
                        limit: query.limit,
                        skip: query.skip,
                        order: getQuestionOrder(query.sort),
                        where: conds,
                        include: [{
                            relation: 'askedBy',
                            scope: {
                                fields: ['id', 'avatar', 'firstName', 'lastName', 'questionCount',
                                    'answerCount', 'bestAnswers', 'points', 'badgeItem']
                            }
                        }]
                    };
                    Question.find(_filter, cb);
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (result.totalCount === -1) {
                    delete result.totalCount;
                }
                Question.personalise(currentUser.id, result.questions, (_err, Questions) => {
                    if (_err) {
                        return next(_err);
                    }
                    result.Questions = Questions;
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

    Question.afterRemote('_GetMyQuestions', (ctx, data, next) => {
        if (data) {
            if (typeof data.totalCount !== 'undefined') {
                ctx.res.set('Access-Control-Expose-Headers', 'x-total-count');
                ctx.res.set('X-Total-Count', data.totalCount);
            }
            ctx.result = data.questions || [];
        }
        next();
    });

    Question.remoteMethod(
        '_GetMyQuestions',
        {
            description: 'Find all my Questions matched by filter from the data source.',
            accessType: 'READ',
            accepts: [
                {
                    arg: 'filter', type: 'object', description:
                        'Filter defining fields, where, include, order, offset, and limit - must be a ' +
                        'JSON-encoded string (`{"where":{"something":"value"}}`).  ' +
                        'See https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries ' +
                        'for more details.'
                },
                {arg: 'options', type: 'object'},
                {arg: 'req', type: 'object', 'http': {source: 'req'}}
            ],
            returns: {arg: 'result', type: 'array', model: 'Question', root: true},
            http: {verb: 'get', path: '/me'}
        }
    );
};
