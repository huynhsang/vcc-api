import async from 'async';
import Joi from 'joi';
import {VOTE_ACTIONS} from '../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (Answer) => {
    Answer.voteRoute = (id, req, callback) => {
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
                Answer.app.models.Vote.updateVoteAnswer(loggedInUser, requestData.voteId, requestData.action, next);
            } else {
                Answer.app.modes.Vote.createVoteAnswer(loggedInUser, id, requestData.action, next);
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

    Answer.remoteMethod(
        'voteRoute',
        {
            accepts: [
                {arg: 'id', type: 'number', description: 'Answer Id', http: {source: 'path'}},
                {arg: 'data', type: 'object', http: {source: 'req'}}
            ],
            description: 'Create answer vote',
            accessType: 'EXECUTE',
            returns: {type: 'Answer', root: true},
            http: {path: '/:id/vote', verb: 'post'}
        }
    );

    Answer.remoteMethod(
        'voteRoute',
        {
            accepts: [
                {arg: 'id', type: 'number', description: 'Answer Id', http: {source: 'path'}},
                {arg: 'data', type: 'object', http: {source: 'req'}}
            ],
            description: 'Update answer vote',
            accessType: 'EXECUTE',
            returns: {type: 'Answer', root: true},
            http: {path: '/:id/vote', verb: 'put'}
        }
    );
};
