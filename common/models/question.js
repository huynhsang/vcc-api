
import validation from './question/validation';
import personalise from './question/methods/personalise';

import approveAnswer from './question/methods/approveAnswer';
import getQuestions from './question/methods/getQuestions';
import getQuestionBySlug from './question/methods/getQuestionBySlug';
import updateStats from './question/methods/updateStats';
import countMethods from './question/methods/countMethods';
import createQuestion from './question/methods/createQuestion';
import editQuestion from './question/methods/editQuestion';

import getAnswersRoute from './question/getAnswersRoute';
import voteRoute from './question/voteRoute';
import createOrUpdateRoute from './question/createOrUpdateRoute';
import approveAnswerRoute from './question/approveAnswerRoute';
import getDetailBySlugRoute from './question/getDetailBySlugRoute';
import getQuestionsRoute from './question/getQuestionsRoute';
import _GetMyQuestions from './question/routes/_GetMyQuestions';

module.exports = function (Question) {
    // Disable loopback remote methods
    Question.disableRemoteMethodByName('create');
    Question.disableRemoteMethodByName('find');
    Question.disableRemoteMethodByName('findById');
    Question.disableRemoteMethodByName('findOrCreate');
    Question.disableRemoteMethodByName('replaceOrCreate');
    Question.disableRemoteMethodByName('replaceById');
    Question.disableRemoteMethodByName('upsertWithWhere');
    Question.disableRemoteMethodByName('upsert');
    Question.disableRemoteMethodByName('deleteById');
    Question.disableRemoteMethodByName('createChangeStream');
    Question.disableRemoteMethodByName('prototype.__get__votes');
    Question.disableRemoteMethodByName('prototype.__findById__votes');
    Question.disableRemoteMethodByName('prototype.__create__votes');
    Question.disableRemoteMethodByName('prototype.__destroyById__votes'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__votes');

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

    // Routes
    createOrUpdateRoute(Question);
    approveAnswerRoute(Question);
    getDetailBySlugRoute(Question);
    getQuestionsRoute(Question);
    getAnswersRoute(Question);
    voteRoute(Question);
    _GetMyQuestions(Question);
};
