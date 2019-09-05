import reputationUtils from './reputation/utils/reputationUtils';
import validation from './reputation/validation';

module.exports = function (Reputation) {
    // Validation
    validation(Reputation);

    /**
     *
     * The method is responsible for handling logic before saving Reputation
     */
    Reputation.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;

        // Handling logic when Update
        if (!ctx.isNewInstance) {
            delete data.created;
            delete data.createdBy;
        } else {
            next();
        }
    });

    // Utils
    reputationUtils(Reputation);
};
