import validation from './reputation/validation';
import createApprove from './reputation/methods/createApprove';
import upsertVoteQuestion from './reputation/methods/upsertVoteQuestion';
import upsertVoteAnswer from './reputation/methods/upsertVoteAnswer';

module.exports = function (Reputation) {
    // Validation
    validation(Reputation);

    createApprove(Reputation);
    upsertVoteQuestion(Reputation);
    upsertVoteAnswer(Reputation);
};
