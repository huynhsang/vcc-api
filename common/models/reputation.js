'use strict';

let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Reputation) {
  /**
   *
   * The method is responsible for handling logic before saving Reputation
   */
  Reputation.observe('before save', function(ctx, next) {
    logger.debug('Before saving Reputation');
    let data = ctx.instance ? ctx.instance : ctx.data;

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let reputationId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(Reputation, reputationId, {}, (err, reputation) => {
        if (err) {
          return next(err);
        }
        if (!reputation) return next(new Error('Reputation is not found!'));
        data.created = reputation.created;
        data.createdBy = reputation.createdBy;
        next();
      });
    } else {
      next();
    }
  });
};
