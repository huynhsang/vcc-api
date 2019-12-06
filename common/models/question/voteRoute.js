import async from 'async';
import Joi from 'joi';
import {VOTE_ACTIONS} from '../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (Question) => {
    Question.voteRoute = (id, req, callback) => {
        const method = req.method.toLowerCase();
        const loggedInUser = req.user;
        const requestData = req.body || req;

        const validateRequestData = (next) => {
            const data = {id, method, ...requestData};
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                method: Joi.string().required(),
                action: Joi.string().valid(VOTE_ACTIONS).required(),
                voteId: Joi.string().hex().length(24).when('method', {
                    is: 'put',
                    then: Joi.required()
                })
            }).required();

            schema.validate(data, {allowUnknown: false}, (err) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next();
            });
        };

        const handleVote = (next) => {
            if (method === 'put') {
                Question.app.models.Vote.updateVoteQuestion(loggedInUser.id, requestData.voteId, requestData.action, next);
            } else {
                Question.app.models.Vote.createVoteQuestion(loggedInUser.id, id, requestData.action, next);
            }
        };

        async.waterfall([
            validateRequestData,
            handleVote
        ], (err, vote) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, vote);
        });
    };

    Question.remoteMethod(
        'voteRoute',
        {
            accepts: [
                {arg: 'id', type: 'string', description: 'Question Id', http: {source: 'path'}},
                {arg: 'req', type: 'object', http: {source: 'req'}}
            ],
            description: 'Create question vote',
            accessType: 'EXECUTE',
            returns: {type: 'Vote', root: true},
            http: {path: '/:id/vote', verb: 'post'}
        }
    );

    Question.remoteMethod(
        'voteRoute',
        {
            accepts: [
                {arg: 'id', type: 'string', description: 'Question Id', http: {source: 'path'}},
                {arg: 'req', type: 'object', http: {source: 'req'}}
            ],
            description: 'Update question vote',
            accessType: 'EXECUTE',
            returns: {type: 'Vote', root: true},
            http: {path: '/:id/vote', verb: 'put'}
        }
    );
};
