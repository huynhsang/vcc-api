import validation from './vote/validation';
import createVoteQuestion from './vote/methods/createVoteQuestion';
import createVoteAnswer from './vote/methods/createVoteAnswer';
import updateVoteQuestion from './vote/methods/updateVoteQuestion';
import updateVoteAnswer from './vote/methods/updateVoteAnswer';

module.exports = function (Vote) {
    validation(Vote);
    createVoteQuestion(Vote);
    createVoteAnswer(Vote);
    updateVoteQuestion(Vote);
    updateVoteAnswer(Vote);
};
