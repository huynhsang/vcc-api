import validation from './answer/validation';
import countMethods from './answer/methods/countMethods';
import approve from './answer/methods/approve';
import updateStats from './answer/methods/updateStats';
import createAnswer from './answer/methods/createAnswer';
import editAnswer from './answer/methods/editAnswer';
import getAnswersByQuestion from './answer/methods/getAnswersByQuestion';

import createOrUpdateRoute from './answer/createOrUpdateRoute';
import voteRoute from './answer/voteRoute';
import approveRoute from './answer/approveRoute';

module.exports = function (Answer) {
    Answer.disableRemoteMethodByName('create');
    Answer.disableRemoteMethodByName('replaceOrCreate');

    // Validation
    validation(Answer);

    // Utils
    approve(Answer);
    updateStats(Answer);
    createAnswer(Answer);
    editAnswer(Answer);
    getAnswersByQuestion(Answer);
    countMethods(Answer);

    // Routes
    createOrUpdateRoute(Answer);
    voteRoute(Answer);
    approveRoute(Answer);
};
