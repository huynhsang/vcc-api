'use strict';

let roleService = require('../../server/boot/services/roleService');

let path = require('path');
let formatter = require('../../utils/formatter');
let logger = require('./../../utils/logger');
let utility = require('./../../utils/appUtility');
let message = require('./../constants/messageConstant');
let appConstant = require('./../constants/appConstant');

module.exports = function(User) {
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
      redirect: null,
      host: process.env.SERVER_ADDRESS,
      user: user,
      protocol: process.env.SERVER_PROTOCOL,
      port: process.env.SERVER_PORT,
    };

    roleService.mappingRoleToUser(User.app, user)
      .then(() => {
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
      })
      .catch((err) => {
        if (err) {
          User.deleteById(user.id);
          return next(err);
        }
      });
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
      redirect: null,
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
