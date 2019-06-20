'use strict';
let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Category) {
  /**
   *
   * The method is responsible for handling logic before saving Category
   */
  Category.observe('before save', function(ctx, next) {
    logger.debug('Before saving Category');

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let categoryId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(Category, categoryId, {}, (err, category) => {
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
