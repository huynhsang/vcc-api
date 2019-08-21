import async from 'async';
import path from 'path';
import appConstant from '../../constants/appConstant';
import message from '../../constants/messageConstant';
import formatter from '../../../utils/formatter';
import roleService from '../../../server/boot/services/roleService';
import {permissionErrorHandler} from '../../modelUtils/modelHelpers';

export default function (User) {
    /**
     * To restrict other user can create admin account (Only admin can create
     * an account with admin role)
     */
    User.beforeRemote('create', function (ctx, user, next) {
        if (user.realm === appConstant.realm.admin) {
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
                from: appConstant.senderEmail,
                subject: message.emailVerificationSubject,
                template: path.resolve(__dirname,
                    '../../../server/views/emailVerificationTemplate.ejs'),
                redirect: null,
                host: process.env.SERVER_ADDRESS,
                user,
                protocol: process.env.SERVER_PROTOCOL,
                port: process.env.SERVER_PORT
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
            sendEmailVerification,
            roleMapping,
            createWallet
        ], (err) => {
            if (err) {
                User.deleteById(user.id);
                return next(err);
            }
            formatter.jsonResponseSuccess(ctx.res, {
                title: message.signUpTitleSuccess,
                content: message.signUpContentSuccess
            });
        });
    });
};
