/* global __ */
import async from 'async';
import path from 'path';
import {permissionErrorHandler} from '../../utils/modelHelpers';
import serverConstant from '../../../configs/constants/serverConstant';
import config from '../../../configs/global/config.global';
import * as roleService from '../../services/roleService';

export default function (User) {
    /**
     * To restrict other user can create admin account (Only admin can create
     * an account with admin role)
     */
    User.beforeRemote('create', function (ctx, user, next) {
        if (user.realm === serverConstant.ADMIN_REALM) {
            User.isAdmin(ctx.req, (err, isAdmin) => {
                if (err) {
                    return next(err);
                }
                if (!isAdmin) {
                    return next(permissionErrorHandler());
                }
                next();
            });
        } else {
            next();
        }
    });

    /**
     * Send verification email after registration
     */
    User.afterRemote('create', function (ctx, user, next) {
        const sendEmailVerification = function (cb) {
            const options = {
                type: 'email',
                to: user.email,
                from: config.SENDER_EMAIL,
                subject: __('account.verification.emailSubject'),
                template: path.resolve(__dirname,
                    '../../../server/views/emailVerificationTemplate.ejs'),
                redirect: null,
                host: config.SERVER_ADDRESS,
                user,
                protocol: config.SERVER_PROTOCOL,
                port: config.SERVER_PORT
            };
            user.verify(options, (err) => {
                if (err) {
                    return cb(err);
                }
                cb();
            });
        };

        const roleMapping = function (cb) {
            roleService.mappingRoleToUser(User.app, user)
                .then(() => {
                    cb();
                })
                .catch((err) => cb(err));
        };

        const createWallet = function (cb) {
            const Wallet = User.app.models.Wallet;
            Wallet.createWallet(user.id, (err) => {
                if (err) return cb(err);
                cb();
            });
        };

        async.waterfall([
            roleMapping,
            createWallet,
            sendEmailVerification
        ], (err) => {
            if (err) {
                User.deleteById(user.id);
                return next(err);
            }
            const data = {
                isSuccess: true,
                title: __('account.register.title'),
                content: __('account.register.content')
            };
            next(null, data);
        });
    });
};
