import validation from './answer/validation';
import personalise from './answer/methods/personalise';

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
    Answer.disableRemoteMethodByName('prototype.__get__votes');
    Answer.disableRemoteMethodByName('prototype.__findById__votes');
    Answer.disableRemoteMethodByName('prototype.__create__votes');
    Answer.disableRemoteMethodByName('prototype.__destroyById__votes'); // DELETE
    Answer.disableRemoteMethodByName('prototype.__updateById__votes');

    // Validation
    validation(Answer);
    personalise(Answer);

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
