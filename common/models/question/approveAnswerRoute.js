import async from 'async';
import Joi from 'joi';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (Question) => {
    /**
     * The method call service to handle approve answer
     * @param id: {Object} The question Id
     * @param req: {Object} The request
     * @param callback: {Function} The callback function
     */
    Question.approveAnswerRoute = (id, req, callback) => {
        const loggedInUser = req.user;
        const requestData = req.body || req;

        const validateRequestData = (next) => {
            const data = {id, ...requestData};
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                answerId: Joi.string().hex().length(24).required()
            }).required();

            Joi.validate(data, schema, {allowUnknown: false}, (err) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next();
            });
        };

        const handleApprove = (next) => {
            Question.approveAnswer(id, requestData.answerId, loggedInUser, (err, result) => {
                if (err) {
                    return next(err);
                }
                next(null, result.answer);
            });
        };

        async.waterfall([
            validateRequestData,
            handleApprove
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
    Question.remoteMethod(
        'approveAnswerRoute',
        {
            accepts: [
                {arg: 'id', type: 'number', description: 'Question Id', http: {source: 'path'}},
                {arg: 'data', type: 'object', http: {source: 'req'}}
            ],
            description: 'Approve answer for question',
            accessType: 'EXECUTE',
            returns: {type: 'object', model: 'Answer', root: true},
            http: {path: '/:id/approveAnswer', verb: 'post'}
        }
    );
};
