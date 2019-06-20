'use strict';

let roleService = require('../../server/boot/services/roleService');

let path = require('path');
let formatter = require('../../utils/formatter');
let logger = require('./../../utils/logger');
let utility = require('./../../utils/appUtility');
let message = require('./../constants/messageConstant');
let appConstant = require('./../constants/appConstant');
let walletService = require('./../../server/boot/services/walletService');

module.exports = function(User) {
  /**
   * To restrict other user can create admin account (Only admin can create
   * an account with admin role)
   */
  User.beforeRemote('create', function(ctx, user, next) {
    if (user.realm === appConstant.realm.admin) {
      if (!ctx.req.accessToken) {
        let err = new Error('UnAuthenticated');
        err.statusCode = 401;
        logger.error(err.toString());
        next(err);
      } else {
        User.findById(ctx.req.accessToken.userId, (err, currentUser) => {
          if (err) return next(err);
          if (!currentUser || currentUser.realm !== appConstant.realm.admin) {
            let err = new Error('Forbiden');
            err.statusCode = 403;
            logger.error(err.toString());
            return next(err);
          }
          next();
        });
      }
    } else {
      next();
    }
  });

  /**
   * Send verification email after registration
   */
  User.afterRemote('create', function(context, user, next) {
    let options = {
      type: 'email',
      to: user.email,
      from: appConstant.senderEmail,
      subject: message.emailVerificationSubject,
      template: path.resolve(__dirname,
        '../../server/views/emailVerificationTemplate.ejs'),
      redirect: '/verified',
      host: process.env.SERVER_ADDRESS,
      user: user,
      protocol: process.env.SERVER_PROTOCOL,
      port: process.env.SERVER_PORT,
    };

    user.verify(options, function(err, response) {
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }
      formatter.jsonResponseSuccess(context.res, {
        title: message.signUpTitleSuccess,
        content: message.signUpContentSuccess,
      });
    });
  });

  /**
   *
   * The method is responsible for handling logic after save user
   */
  User.observe('after save', function(ctx, next) {
    if (ctx.isNewInstance) {
      roleService.mappingRoleToUser(User.app, ctx.instance)
        .then(() => {
          walletService.createWallet(User.app, ctx.instance.id, (err) => {
            if (err) return next(err);
            next();
          });
        })
        .catch((err) => {
          if (err) {
            User.deleteById(ctx.instance.id);
            return next(err);
          }
        });
    } else {
      next();
    }
  });

  /**
   * Method to re-set the email configuration before do verify
   */
  User.beforeRemote('prototype.verify', function(context, user, next) {
    context.args.verifyOptions = {
      type: 'email',
      to: user.email,
      from: appConstant.senderEmail,
      subject: message.emailVerificationSubject,
      template: path.resolve(__dirname,
        '../../server/views/emailVerificationTemplate.ejs'),
      redirect: '/verified',
      host: process.env.SERVER_ADDRESS,
      user: user,
      protocol: process.env.SERVER_PROTOCOL,
      port: process.env.SERVER_PORT,
    };
    next();
  });

  /**
   * Method to request a verification email for re-verifying account
   */
  User.afterRemote('prototype.verify', function(context, user, next) {
    formatter.jsonResponseSuccess(context.res, {
      title: message.reverificationResponseTitle,
      content: message.reverificationResponseContent,
    });
  });

  /**
   * Send password reset link when requested
   */
  User.on('resetPasswordRequest', function(info) {
    let url = utility.getFullDomain(User.app) + '/reset-password';
    let html = 'Click <a href="' + url + '?accessToken=' +
      info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: appConstant.senderEmail,
      subject: message.resetPasswordEmailSubject,
      html: html,
    }, function(err) {
      if (err) return logger.error(message.sendingPasswordResetToEmailError);
      logger.info(message.sendingPasswordResetToEmailSuccess, info.email);
    });
  });

  /**
   * Response after password change
   */
  User.afterRemote('changePassword', function(context, user, next) {
    formatter.jsonResponseSuccess(context.res, {
      title: message.changePasswordResponseTitleSuccess,
      content: message.changePasswordResponseContentSuccess,
    });
  });

  /**
   * Response after password reset
   */
  User.afterRemote('setPassword', function(context, user, next) {
    formatter.jsonResponseSuccess(context.res, {
      title: message.resetPasswordResponseTitleSuccess,
      content: message.resetPasswordResponseContentSuccess,
    });
  });

  /**
   * Response after logout
   */
  User.afterRemote('logout', function(context, user, next) {
    formatter.jsonResponseSuccess(context.res, {
      title: message.logoutSuccess,
      content: '',
    });
  });
};
