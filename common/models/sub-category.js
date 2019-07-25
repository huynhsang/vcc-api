'use strict';

let appConstant = require('../constants/appConstant');
let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

const getTrendingTagsRoute = require('./subcategory/getTrendingTagsRoute');
const getTagsRoute = require('./subcategory/getTagsRoute');

module.exports = function(SubCategory) {
  getTrendingTagsRoute(SubCategory);
  getTagsRoute(SubCategory);

  /**
   * The method is responsible for handling logic before create new SubCategory
   */
  SubCategory.beforeRemote('create', function(ctx, base, next) {
    logger.debug('Before create SubCategory');
    if (!ctx.req.accessToken) {
      repository.findOne(SubCategory.app.models.User, {
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
   * The method is responsible for handling logic before saving SubCategory
   */
  SubCategory.observe('before save', function(ctx, next) {
    logger.debug('Before saving SubCategory');

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let subCategoryId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(SubCategory, subCategoryId, {},
        (err, subCategory) => {
          if (err) {
            return next(err);
          }
          if (!subCategory) return next(new Error('SubCategory is not found!'));
          let data = ctx.instance ? ctx.instance : ctx.data;
          data.created = subCategory.created;
          data.createdBy = subCategory.createdBy;
          next();
        });
    } else {
      next();
    }
  });
};
