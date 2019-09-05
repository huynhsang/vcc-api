/* global __ */
import path from 'path';
import {logError, logInfo} from '../../services/loggerService';
import config from '../../../configs/global/config.global';

export default function (User) {
    /**
     * Method to re-set the email configuration before do verify
     */
    User.beforeRemote('prototype.verify', function (ctx, user, next) {
        ctx.args.verifyOptions = {
            type: 'email',
            to: user.email,
            from: config.SENDER_EMAIL,
            subject: __('account.verification.emailSubject'),
            template: path.resolve(__dirname,
                '../../../server/views/emailVerificationTemplate.ejs'),
            redirect: '/verified',
            host: process.env.SERVER_ADDRESS,
            user,
            protocol: process.env.SERVER_PROTOCOL,
            port: process.env.SERVER_PORT
        };
        next();
    });

    /**
     * Method to request a verification email for re-verifying account
     */
    User.afterRemote('prototype.verify', function (ctx, user, next) {
        const data = {
            isSuccess: true,
            title: __('account.verification.title'),
            content: __('account.verification.content')
        };
        ctx.res.status(204).json(data);
        next();
    });

    /**
     * Send password reset link when requested
     */
    User.on('resetPasswordRequest', function (info) {
        const url = config.FULL_DOMAIN + '/reset-password';
        const html = 'Click <a href="' + url + '?accessToken=' +
            info.accessToken.id + '">here</a> to reset your password';

        User.app.models.Email.send({
            to: info.email,
            from: config.SENDER_EMAIL,
            subject: __('account.resetPassword.emailSubject'),
            html
        }, function (err) {
            if (err) {
                err.metaData = {
                    message: __('err.account.resetPassword.emailRequest'),
                    toEmail: info.email
                };
                return logError(err);
            }
            logInfo(`${__('account.resetPassword.requestSuccess')} ${info.email}`);
        });
    });

    /**
     * Response after password change
     */
    User.afterRemote('changePassword', function (ctx, user, next) {
        const data = {
            isSuccess: true,
            title: __('account.changePassword.title'),
            content: __('account.changePassword.content')
        };
        ctx.res.status(204).json(data);
        next();
    });

    /**
     * Response after password reset
     */
    User.afterRemote('setPassword', function (ctx, user, next) {
        const data = {
            isSuccess: true,
            title: __('account.resetPassword.title'),
            content: __('account.resetPassword.content')
        };
        ctx.res.status(204).json(data);
        next();
    });

    /**
     * Response after logout
     */
    User.afterRemote('logout', function (ctx, user, next) {
        const data = {
            isSuccess: true,
            title: __('account.logout.title'),
            content: ''
        };
        ctx.res.status(204).json(data);
        next();
    });
};
