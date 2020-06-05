import disableRoutes from './question/disableRoutes';
import validation from './question/validation';
import personalise from './question/methods/personalise';

import approveAnswer from './question/methods/approveAnswer';
import getQuestions from './question/methods/getQuestions';
import getQuestionBySlug from './question/methods/getQuestionBySlug';
import updateStats from './question/methods/updateStats';
import countMethods from './question/methods/countMethods';
import createQuestion from './question/methods/createQuestion';
import editQuestion from './question/methods/editQuestion';
import removeQuestion from './question/methods/removeQuestion';

import _GetAnswers from './question/routes/_GetAnswers';
import _Vote from './question/routes/_Vote';
import _Upsert from './question/routes/_Upsert';
import _ApproveAnswer from './question/routes/_ApproveAnswer';
import _GetDetailBySlug from './question/routes/_GetDetailBySlug';
import _GetQuestions from './question/routes/_GetQuestions';
import _GetMyQuestions from './question/routes/_GetMyQuestions';
import _DeleteById from './question/routes/_DeleteById';

module.exports = function (Question) {
    // Disable loopback remote methods
    disableRoutes(Question);

    // Validation
    validation(Question);
    personalise(Question);

    // Methods
    updateStats(Question);
    approveAnswer(Question);
    getQuestions(Question);
    getQuestionBySlug(Question);
    countMethods(Question);
    createQuestion(Question);
    editQuestion(Question);
    removeQuestion(Question);

    // Routes
    _Upsert(Question);
    _ApproveAnswer(Question);
    _GetDetailBySlug(Question);
    _GetQuestions(Question);
    _GetAnswers(Question);
    _Vote(Question);
    _GetMyQuestions(Question);
    _DeleteById(Question);
};
