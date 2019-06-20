'use strict';
let logger = require('./../../utils/logger');
let repository = require(
  '../../server/common/repositories/persistedModelExtend');

module.exports = function(Wallet) {
  /**
   *
   * The method is responsible for handling logic before saving Wallet
   */
  Wallet.observe('before save', function(ctx, next) {
    logger.debug('Before saving Wallet');

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let walletId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      repository.findById(Wallet, walletId, {}, (err, wallet) => {
        if (err) {
          return next(err);
        }
        if (!wallet) return next(new Error('Wallet is not found!'));
        let data = ctx.instance ? ctx.instance : ctx.data;
        data.created = wallet.created;
        data.createdBy = wallet.createdBy;
        next();
      });
    } else {
      next();
    }
  });

  /**
   * To disable APIs
   */
  Wallet.disableRemoteMethodByName('deleteById');
};
