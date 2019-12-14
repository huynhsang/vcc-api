import _ from 'lodash';
import async from 'async';
import {ADMIN_REALM, USER_REALM, VERIFICATION_EMAIL} from '../../../../configs/constants/serverConstant';
import roleService from '../../../services/roleService';
import {createTask} from '../../../../queues/producers/taskManager';

export default (User) => {
    User.register = (formData, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        const payload = _.pick(formData, ['email', 'password', 'firstName', 'lastName']);
        payload.realm = USER_REALM;

        if (options && options.admin) {
            payload.realm = ADMIN_REALM;
        }

        async.waterfall([
            (next) => {
                User.create(payload, next);
            },
            (user, next) => {
                async.parallel([
                    (cb) => {
                        roleService.mappingRoleToUser(user, cb);
                    },
                    (cb) => {
                        User.app.models.Wallet.createWallet(user.id, cb);
                    },
                    (cb) => {
                        createTask('SEND_MAIL_TASK', {type: VERIFICATION_EMAIL, to: user.email}, cb);
                    }
                ], (err) => {
                    if (err) {
                        return next(err);
                    }
                    next(null, user);
                });
            }
        ], (err, user) => {
            if (err) {
                User.deleteById(user.id);
                return callback(err);
            }
            callback(null, user.toObject(true, true, true));
        });
    };
};
