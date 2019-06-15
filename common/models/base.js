'use strict';

let appConstant = require('../constants/appConstant');
let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Base) {
  /**
   * The method is responsible for handling logic before create new Object
   */
  Base.beforeRemote('create', function(ctx, base, next) {
    logger.debug('Before create Base');
    if (!ctx.req.accessToken) {
      repository.findOne(Base.app.models.User, {
        where: {
          email: appConstant.adminEmail,
          realm: appConstant.realm.admin,
        },
      }).then(user => {
        if (!user) return next(new Error('System account not found!'));
        ctx.args.data.createdBy = ctx.args.data.updatedBy = user.id;
        next();
      }).catch(err => {
        next(err);
      });
    } else {
      ctx.args.data.createdBy = ctx.args.data.updatedBy =
        ctx.req.accessToken.userId;
      next();
    }
  });

  /**
   *
   * The method is responsible for handling logic before saving Object
   */
  Base.observe('before save', function(ctx, next) {
    logger.debug('Before saving Base');
    let data = ctx.instance ? ctx.instance : ctx.data;
    if (ctx.options.accessToken) {
      data.updatedBy = ctx.options.accessToken.userId;
    }
    // Whenever Write method is called, updating values should up to date.
    data.updated = new Date();

    next();
  });
};
