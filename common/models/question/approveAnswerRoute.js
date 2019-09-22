/* global __ */
import async from 'async';
import Joi from 'joi';
import {errorHandler, notFoundErrorHandler} from '../../utils/modelHelpers';

export default function (Question) {
    /**
     * The method call service to handle approve answer
     * @param data: {Object} The data uses for approving function
     * @param options: {Object} The options
     * @param callback: {Function} The callback function
     */
    Question.approveAnswer = function (data, options, callback) {
        const userId = options.accessToken.userId;

        const schema = Joi.object().keys({
            id: Joi.number().integer().min(1).required(),
            answerId: Joi.number().integer().min(1).required()
        }).required();

        const validateRequestData = function (next) {
            Joi.validate(data, schema, {allowUnknown: false}, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        };

        const verifyAnswer = function (next) {
            const Answer = Question.app.models.Answer;
            Answer.findOne({
                where: {
                    id: data.answerId,
                    questionId: data.questionId,
                    isTheBest: false
                }
            }, (err, _answer) => {
                if (err) {
                    return next(err);
                }
                if (!_answer) {
                    return next(notFoundErrorHandler(__('error.answer.notExists')));
                }
                if (_answer.createdBy === userId) {
                    return next(new Error(__('error.answer.voteIsDenied')));
                }
                next(null, _answer);
            });
        };

        // Todo: Adding transaction to handle logic here
        // let transaction = null;
        // const initTransaction = function (next) {
        //     Question.beginTransaction({
        //         isolationLevel: Question.Transaction.READ_COMMITTED
        //     }, (err, tx) => {
        //         if (err) {
        //             return next(err);
        //         }
        //         transaction = tx;
        //         next();
        //     });
        // };

        const findAndUpdate = function (answer, next) {
            Question.updateAll({
                id: data.id,
                hasAcceptedAnswer: false
            }, {hasAcceptedAnswer: true}, (err, info) => {
                if (err) {
                    return next(err);
                }
                if (info.count === 0) {
                    return next(notFoundErrorHandler(__('error.question.notExists')));
                }
                answer.updateAttribute('isTheBest', true, (_err, _updated) => {
                    if (_err) {
                        return next(_err);
                    }
                    next(null, _updated);
                });
            });
        };

        const updateRelatedApproval = function (answer, next) {
            Question.app.models.Reputation.createReputationWithAcceptAction(answer, userId, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, answer);
            });
        };

        async.waterfall([
            validateRequestData,
            verifyAnswer,
            findAndUpdate,
            updateRelatedApproval
        ], (err, answer) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answer);
        });
    };

    /**
     * To Describe API end point to approve answer
     */
    Question.remoteMethod('approveAnswer', {
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'body'}},
            {arg: 'options', type: 'object', http: 'optionsFromRequest'}
        ],
        description: 'Approve answer for question',
        accessType: 'EXECUTE',
        returns: {type: 'Answer', root: true},
        http: {path: '/approve-answer', verb: 'post'}
    });
}
