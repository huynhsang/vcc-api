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
                createTask('SEND_MAIL_TASK', {type: VERIFICATION_EMAIL, to: user.email}, (err) => {
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

    User.observe('after save', (ctx, next) => {
        if (!ctx.isNewInstance || !ctx.instance) {
            return next();
        }
        async.parallel([
            (cb) => {
                roleService.mappingRoleToUser(ctx.instance, cb);
            },
            (cb) => {
                User.app.models.Wallet.createWallet(ctx.instance.id, cb);
            }
        ], (err) => {
            if (err) {
                User.deleteById(ctx.instance.id);
                return next(err);
            }
            next();
        });
    });
};
