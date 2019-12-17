import validation from './vote/validation';
import personaliseModels from './vote/methods/personaliseModels';
import voteAnswer from './vote/methods/voteAnswer';
import voteQuestion from './vote/methods/voteQuestion';
import afterRemoveVote from './vote/methods/afterRemoveVote';

module.exports = function (Vote) {
    validation(Vote);
    personaliseModels(Vote);

    voteAnswer(Vote);
    voteQuestion(Vote);
    afterRemoveVote(Vote);
};
