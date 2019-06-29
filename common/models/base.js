'use strict';

let logger = require('./../../utils/logger');

module.exports = function(Base) {
  /**
   *
   * The method is responsible for handling logic before saving Object
   */
  Base.observe('before save', function(ctx, next) {
    if (!ctx.isNewInstance) {
      logger.debug('Before updating Base');
      let data = ctx.instance ? ctx.instance : ctx.data;
      if (ctx.options.accessToken) {
        data.updatedBy = ctx.options.accessToken.userId;
      }
      // Whenever Write method is called, updating values should up to date.
      data.updated = new Date();
    }
    next();
  });
};
