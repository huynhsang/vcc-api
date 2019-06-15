'use strict';

let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Answer) {
  /**
   *
   * The method is responsible for handling logic before saving Answer
   */
  Answer.observe('before save', function(ctx, next) {
    logger.debug('Before saving Answer');

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let authorId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(Answer, authorId)
        .then(author => {
          let data = ctx.instance ? ctx.instance : ctx.data;
          data.created = author.created;
          data.createdBy = author.createdBy;
          next();
        })
        .catch(err => {
          next(err);
        });
    } else {
      next();
    }
  });
};
