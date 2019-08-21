import path from 'path';
import appConstant from '../../constants/appConstant';
import message from '../../constants/messageConstant';
import formatter from '../../../utils/formatter';
import logger from '../../../utils/logger';
import utility from '../../../utils/appUtility';

export default function (User) {
    /**
     * Method to re-set the email configuration before do verify
     */
    User.beforeRemote('prototype.verify', function (ctx, user, next) {
        ctx.args.verifyOptions = {
            type: 'email',
            to: user.email,
            from: appConstant.senderEmail,
            subject: message.emailVerificationSubject,
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
        formatter.jsonResponseSuccess(ctx.res, {
            title: message.reverificationResponseTitle,
            content: message.reverificationResponseContent
        });
        next();
    });

    /**
     * Send password reset link when requested
     */
    User.on('resetPasswordRequest', function (info) {
        const url = utility.getFullDomain(User.app) + '/reset-password';
        const html = 'Click <a href="' + url + '?accessToken=' +
            info.accessToken.id + '">here</a> to reset your password';

        User.app.models.Email.send({
            to: info.email,
            from: appConstant.senderEmail,
            subject: message.resetPasswordEmailSubject,
            html
        }, function (err) {
            if (err) return logger.error(message.sendingPasswordResetToEmailError);
            logger.info(message.sendingPasswordResetToEmailSuccess, info.email);
        });
    });

    /**
     * Response after password change
     */
    User.afterRemote('changePassword', function (ctx, user, next) {
        formatter.jsonResponseSuccess(ctx.res, {
            title: message.changePasswordResponseTitleSuccess,
            content: message.changePasswordResponseContentSuccess
        });
        next();
    });

    /**
     * Response after password reset
     */
    User.afterRemote('setPassword', function (ctx, user, next) {
        formatter.jsonResponseSuccess(ctx.res, {
            title: message.resetPasswordResponseTitleSuccess,
            content: message.resetPasswordResponseContentSuccess
        });
        next();
    });

    /**
     * Response after logout
     */
    User.afterRemote('logout', function (ctx, user, next) {
        formatter.jsonResponseSuccess(ctx.res, {
            title: message.logoutSuccess,
            content: ''
        });
        next();
    });
};
