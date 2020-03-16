import async from 'async';
import Joi from 'joi';
import {DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default function (Question) {
    /**
     * The method will call the service to get answers by question Id
     *
     * @param req: {Object} The request
     * @param id {Number} The question Id
     * @param callback {Function} Callback function.
     */
    Question._GetAnswers = (id, req, callback) => {
        const loggedInUser = req.user;
        const query = req.query || req;

        const validateQuery = (next) => {
            query.id = id;
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                filter: Joi.object().keys({
                    where: Joi.object().optional(),
                    limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                    skip: Joi.number().integer().min(0).default(0),
                    order: Joi.alternatives().try([Joi.string(), Joi.array()]).optional()
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

        const queryAnswers = (validQuery, next) => {
            const Answer = Question.app.models.Answer;
            Answer.getAnswersByQuestion(id, validQuery.filter, {totalCount: validQuery.totalCount}, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (!loggedInUser) {
                    return next(null, result);
                }
                Answer.personalise(loggedInUser.id, result.answers, (_err, answers) => {
                    if (_err) {
                        return next(_err);
                    }
                    result.answers = answers;
                    next(null, result);
                });
            });
        };

        async.waterfall([
            validateQuery,
            queryAnswers
        ], (err, result) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, result);
        });
    };

    Question.afterRemote('_GetAnswers', (ctx, data, next) => {
        if (data) {
            if (typeof data.totalCount !== 'undefined') {
                ctx.res.set('Access-Control-Expose-Headers', 'x-total-count');
                ctx.res.set('X-Total-Count', data.totalCount);
            }
            ctx.result = data.answers || [];
        }
        next();
    });

    /**
     * To Describe API end point to get answers by question Id
     */
    Question.remoteMethod(
        '_GetAnswers',
        {
            accessType: 'READ',
            accepts: [
                {arg: 'id', type: 'string', description: 'Question Id', http: {source: 'path'}},
                {arg: 'req', type: 'object', http: {source: 'req'}}
            ],
            description: 'Find all Answers By question Id',
            returns: {type: 'array', model: 'Answer', root: true},
            http: {path: '/:id/answers', verb: 'get'}
        }
    );
}
