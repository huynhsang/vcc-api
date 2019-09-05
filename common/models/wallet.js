import walletUtils from './wallet/utils/walletUtils';
import validation from './wallet/validation';

module.exports = function (Wallet) {
    // Validation
    validation(Wallet);

    /**
     *
     * The method is responsible for handling logic before saving Wallet
     */
    Wallet.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;

        // Handling logic when Update
        if (!ctx.isNewInstance) {
            delete data.created;
            delete data.createdBy;
            next();
        } else {
            next();
        }
    });

    // Utils
    walletUtils(Wallet);

    /**
     * To disable APIs
     */
    Wallet.disableRemoteMethodByName('deleteById');
};
