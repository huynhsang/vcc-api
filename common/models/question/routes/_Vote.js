import async from 'async';
import Joi from 'joi';
import {VOTE_ACTIONS} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default (Question) => {
    Question._Vote = (id, body, req, callback) => {
        const loggedInUser = req.user;

        const validateRequestData = (next) => {
            const data = {id, action: body.action};
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                action: Joi.string().valid(VOTE_ACTIONS).required()
            }).required();

            schema.validate(data, {allowUnknown: false}, (err) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next();
            });
        };

        const handleVote = (next) => {
            Question.app.models.Vote.voteQuestion(loggedInUser.id, id, body.action, next);
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
        '_Vote',
        {
            accepts: [
                {arg: 'id', type: 'string', description: 'Question Id', http: {source: 'path'}},
                {arg: 'body', type: 'object', description: 'Body', http: {source: 'body'}},
                {arg: 'req', type: 'object', http: {source: 'req'}}
            ],
            description: 'Voting a question',
            accessType: 'EXECUTE',
            returns: {type: 'Vote', root: true},
            http: {path: '/:id/vote', verb: 'post'}
        }
    );
};
