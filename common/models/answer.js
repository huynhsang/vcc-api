import validation from './answer/validation';
import personalise from './answer/methods/personalise';

import countMethods from './answer/methods/countMethods';
import approve from './answer/methods/approve';
import updateStats from './answer/methods/updateStats';
import createAnswer from './answer/methods/createAnswer';
import editAnswer from './answer/methods/editAnswer';
import getAnswersByQuestion from './answer/methods/getAnswersByQuestion';

import _Upsert from './answer/routes/_Upsert';
import _Vote from './answer/routes/_Vote';
import disableRoutes from './answer/disableRoutes';

module.exports = function (Answer) {
    disableRoutes(Answer);

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
    _Upsert(Answer);
    _Vote(Answer);
};
