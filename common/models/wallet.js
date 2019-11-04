import walletUtils from './wallet/utils/walletUtils';
import validation from './wallet/validation';

module.exports = function (Wallet) {
    // Validation
    validation(Wallet);

    // Utils
    walletUtils(Wallet);

    /**
     * To disable APIs
     */
    Wallet.disableRemoteMethodByName('deleteById');
};
