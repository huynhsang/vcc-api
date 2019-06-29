'use strict';

let appConstant = require('../constants/appConstant');
let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Category) {
  /**
   * The method is responsible for handling logic before create new Object
   */
  Category.beforeRemote('create', function(ctx, base, next) {
    logger.debug('Before create Category');
    if (!ctx.req.accessToken) {
      repository.findOne(Category.app.models.User, {
        where: {
          email: appConstant.adminEmail,
          realm: appConstant.realm.admin,
        },
      }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(new Error('System account not found!'));
        ctx.args.data.createdBy = ctx.args.data.updatedBy = user.id;
        next();
      });
    } else {
      ctx.args.data.createdBy = ctx.args.data.updatedBy =
        ctx.req.accessToken.userId;
      next();
    }
  });

  /**
   *
   * The method is responsible for handling logic before saving Category
   */
  Category.observe('before save', function(ctx, next) {
    logger.debug('Before saving Category');

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let categorySlug = ctx.instance ? ctx.instance.slug :
        ctx.currentInstance ? ctx.currentInstance.slug : ctx.data.slug;
      repository.findById(Category, categorySlug, {}, (err, category) => {
        if (err) {
          return next(err);
        }
        if (!category) return next(new Error('Category is not found!'));
        let data = ctx.instance ? ctx.instance : ctx.data;
        data.created = category.created;
        data.createdBy = category.createdBy;
        next();
      });
    } else {
      next();
    }
  });
};
