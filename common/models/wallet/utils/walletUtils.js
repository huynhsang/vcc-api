import * as shortid from 'shortid';

export default function (Wallet) {
    /**
     * The method handles logic to create new wallet for given user id
     * @param userId: {String} the owner id
     * @param callback: {Function} The callback function
     */
    Wallet.createWallet = function (userId, callback) {
        const data = {
            amount: 0,
            ownerId: userId,
            shortId: shortid.generate()
        };
        Wallet.findOrCreate({
            where: {
                ownerId: userId
            }
        }, data, (err, instance) => {
            if (err) {
                return callback(err);
            }
            callback(null, instance);
        });
    };
}
