import validation from './vote/validation';
import createVoteQuestion from './vote/methods/createVoteQuestion';
import createVoteAnswer from './vote/methods/createVoteAnswer';
import updateVoteQuestion from './vote/methods/updateVoteQuestion';
import updateVoteAnswer from './vote/methods/updateVoteAnswer';
import personaliseModels from './vote/methods/personaliseModels';
import removeVote from './vote/methods/removeVote';
import voteQuestion from './vote/methods/voteQuestion';

module.exports = function (Vote) {
    validation(Vote);
    personaliseModels(Vote);
    createVoteQuestion(Vote);
    createVoteAnswer(Vote);
    updateVoteQuestion(Vote);
    updateVoteAnswer(Vote);

    voteQuestion(Vote);
    removeVote(Vote);
};
