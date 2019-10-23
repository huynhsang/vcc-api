/* global __ */
import async from 'async';
import Joi from 'joi';
import {errorHandler, validationErrorHandler} from '../../utils/modelHelpers';

export default (Answer) => {
    /**
     * The method call service to handle approve answer
     * @param id: {Object} The answer Id
     * @param req: {Object} The request
     * @param callback: {Function} The callback function
     */
    Answer.approveRoute = (id, req, callback) => {
        const loggedInUser = req.user;

        if (Joi.string().hex().length(24).required().validate(id).error) {
            return callback(validationErrorHandler(__('err.invalidRequest')));
        }

        Answer.approve(id, loggedInUser, (err, answer) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answer);
        });
    };

    /**
     * To Describe API end point to approve answer
     */
    Answer.remoteMethod(
        'approveRoute',
        {
            accepts: [
                {arg: 'id', type: 'number', description: 'Answer Id', http: {source: 'path'}},
                {arg: 'data', type: 'object', http: {source: 'req'}}
            ],
            description: 'Approve answer for Answer',
            accessType: 'EXECUTE',
            returns: {type: 'object', model: 'Answer', root: true},
            http: {path: '/:id/approve', verb: 'post'}
        }
    );
};
