import _ from 'lodash';
import async from 'async';
import {ADMIN_REALM, USER_REALM, VERIFICATION_EMAIL} from '../../../../configs/constants/serverConstant';
import roleService from '../../../services/roleService';
import {createTask} from '../../../../queues/producers/taskManager';
import * as shortid from 'shortid';

export default (User) => {
    User.register = (formData, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        const payload = _.pick(formData, ['email', 'password', 'firstName', 'lastName']);
        payload.realm = USER_REALM;
        payload.username = `user_${shortid.generate()}`;

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
                        createTask('SEND_MAIL_TASK', {type: VERIFICATION_EMAIL, to: user.email}, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            cb();
                        });
                    },
                    (cb) => {
                        createTask('ACTIVITY_TASK',{
                            activityName: 'JOIN_VCNC',
                            activityModelType: User.modelName,
                            activityModelId: user.id,
                            ownerId: user.id
                        }, (err) =>{
                            if (err) {
                                return cb(err);
                            }
                            cb();
                        });
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
