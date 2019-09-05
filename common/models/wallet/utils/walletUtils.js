import * as shortid from 'shortid';

export default function (Wallet) {
    /**
     * The method handles logic to create new wallet for given user id
     * @param userId: {Number} the owner id
     * @param callback: {Function} The callback function
     */
    Wallet.createWallet = function (userId, callback) {
        const newWallet = {
            amount: 0,
            ownerId: userId,
            createdBy: userId,
            updatedBy: userId,
            shortId: shortid.generate()
        };
        Wallet.upsert(newWallet, (err, _wallet) => {
            if (err) {
                return callback(err);
            }
            callback(null, _wallet);
        });
    };
}
