'use strict';

const async = require('async');
const path = require('path');
const appConstant = require('../../constants/appConstant');
const message = require('./../../constants/messageConstant');
const logger = require('../../../utils/logger');
const formatter = require('../../../utils/formatter');
const roleService = require('../../../server/boot/services/roleService');
const walletService = require('../../../server/boot/services/walletService');

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
    const sendEmailVerification = function(cb) {
      const options = {
        type: 'email',
        to: user.email,
        from: appConstant.senderEmail,
        subject: message.emailVerificationSubject,
        template: path.resolve(__dirname,
          '../../../server/views/emailVerificationTemplate.ejs'),
        redirect: null,
        host: process.env.SERVER_ADDRESS,
        user: user,
        protocol: process.env.SERVER_PROTOCOL,
        port: process.env.SERVER_PORT,
      };
      user.verify(options, (err) => {
        if (err) {
          return cb(err);
        }
        cb();
      });
    };

    const roleMapping = function(cb) {
      roleService.mappingRoleToUser(User.app, user)
        .then(() => {
          cb();
        })
        .catch((err) => cb(err));
    };

    const createWallet = function(cb) {
      walletService.createWallet(User.app, user.id, (err) => {
        if (err) return cb(err);
        cb();
      });
    };

    async.waterfall([
      sendEmailVerification,
      roleMapping,
      createWallet,
    ], (err) => {
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
};
