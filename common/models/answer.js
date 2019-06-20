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
      let answerId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(Answer, answerId, {}, (err, answer) => {
        if (err) return next(err);
        if (!answer) return next(new Error('Answer not found!'));
        let data = ctx.instance ? ctx.instance : ctx.data;
        data.created = answer.created;
        data.createdBy = answer.createdBy;
        next();
      });
    } else {
      next();
    }
  });
};
