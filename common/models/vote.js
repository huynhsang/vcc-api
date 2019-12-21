import validation from './vote/validation';
import personaliseModels from './vote/methods/personaliseModels';
import voteAnswer from './vote/methods/voteAnswer';
import voteQuestion from './vote/methods/voteQuestion';
import updateVote from './vote/methods/updateVote';

module.exports = function (Vote) {
    validation(Vote);
    personaliseModels(Vote);
    updateVote(Vote);
    voteAnswer(Vote);
    voteQuestion(Vote);
};
