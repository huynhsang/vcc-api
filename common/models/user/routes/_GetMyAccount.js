/* global __ */
import {errorHandler, notFoundErrorHandler} from '../../../utils/modelHelpers';

export default (User) => {
    User._GetMyAccount = (req, callback) => {
        let currentUser = req.user;
        if (!currentUser) {
            return callback(notFoundErrorHandler(__('err.user.notExists')));
        }
        if (!req.user.isEnable) {
            return callback(notFoundErrorHandler(__('err.user.notAvailable')));
        }
        currentUser.getRoles((err, roles) => {
            if (err) {
                return callback(errorHandler(err));
            }
            currentUser = currentUser.toObject(true, true, true);
            currentUser.roles = roles;
            callback(null, currentUser);
        });
    };

    User.remoteMethod('_GetMyAccount', {
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}}
        ],
        description: 'Find my account',
        returns: {type: 'object', model: 'user', root: true},
        http: {path: '/me', verb: 'get'}
    });
};
