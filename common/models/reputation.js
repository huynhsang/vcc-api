import validation from './reputation/validation';
import createApprove from './reputation/methods/createApprove';
import upsertVoteQuestion from './reputation/methods/upsertVoteQuestion';
import upsertVoteAnswer from './reputation/methods/upsertVoteAnswer';

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
            delete data.createdBy;
        } else {
            next();
        }
    });

    createApprove(Reputation);
    upsertVoteQuestion(Reputation);
    upsertVoteAnswer(Reputation);
};
