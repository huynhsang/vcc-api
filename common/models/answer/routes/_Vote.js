import async from 'async';
import Joi from 'joi';
import {VOTE_ACTIONS} from '../../../../configs/constants/serverConstant';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default (Answer) => {
    Answer._Vote = (id, body, req, callback) => {
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
            Answer.app.models.Vote.voteAnswer(loggedInUser.id, id, body.action, next);
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
        '_Vote',
        {
            accepts: [
                {arg: 'id', type: 'string', description: 'Question Id', http: {source: 'path'}},
                {arg: 'body', type: 'object', description: 'Body', http: {source: 'body'}},
                {arg: 'req', type: 'object', http: {source: 'req'}}
            ],
            description: 'Voting answer',
            accessType: 'EXECUTE',
            returns: {type: 'Answer', root: true},
            http: {path: '/:id/vote', verb: 'post'}
        }
    );
};
