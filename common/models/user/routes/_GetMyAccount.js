/* global __ */
import {notFoundErrorHandler} from '../../../utils/modelHelpers';

export default (User) => {
    User._GetMyAccount = (req, callback) => {
        if (!req.user) {
            return callback(notFoundErrorHandler(__('err.user.notExists')));
        }
        // if (!req.user.isEnable) {
        //     return callback(notFoundErrorHandler(__('err.user.notAvailable')));
        // }
        callback(null, req.user);
    };

    User.remoteMethod('_GetMyAccount', {
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
        ],
        description: 'Find my account',
        returns: {type: 'object', model: 'user', root: true},
        http: {path: '/me', verb: 'get'}
    });
};
