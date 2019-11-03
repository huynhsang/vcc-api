/* global __ */
import {USER_REALM} from '../../../configs/constants/serverConstant';
import {errorHandler, notFoundErrorHandler} from '../../utils/modelHelpers';

export default function (User) {
    User.getProfileById = function (id, cb) {
        User.findOne({
            where: {
                id,
                emailVerified: true,
                isEnable: true,
                realm: USER_REALM
            }
        }, (err, _user) => {
            if (err) {
                return cb(errorHandler(err));
            }
            if (!_user) {
                return cb(notFoundErrorHandler(__('err.user.notExists')));
            }
            cb(null, _user);
        });
    };

    User.remoteMethod('getProfileById', {
        accepts: [
            {arg: 'id', type: 'string', required: true}
        ],
        description: 'Find user by id',
        returns: {type: 'object', model: 'user', root: true},
        http: {path: '/profile', verb: 'get'}
    });
};
