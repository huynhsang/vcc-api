import approveAnswerRoute from './question/approveAnswerRoute';
import getDetailBySlugRoute from './question/getDetailBySlugRoute';
import getQuestionsRoute from './question/getQuestionsRoute';
import validation from './question/validation';
import getAnswersRoute from './question/getAnswersRoute';
import approveAnswer from './question/methods/approveAnswer';
import getQuestions from './question/methods/getQuestions';
import getQuestionBySlug from './question/methods/getQuestionBySlug';
import updateStats from './question/methods/updateStats';
import voteRoute from './question/voteRoute';
import countMethods from './question/methods/countMethods';
import createQuestion from './question/methods/createQuestion';
import editQuestion from './question/methods/editQuestion';
import createOrUpdateRoute from './question/createOrUpdateRoute';

module.exports = function (Question) {
    // Disable loopback remote methods
    Question.disableRemoteMethodByName('create');
    Question.disableRemoteMethodByName('find');
    Question.disableRemoteMethodByName('findOrCreate');
    Question.disableRemoteMethodByName('replaceOrCreate');
    Question.disableRemoteMethodByName('replaceById');
    Question.disableRemoteMethodByName('upsertWithWhere');
    Question.disableRemoteMethodByName('upsert');
    Question.disableRemoteMethodByName('deleteById');
    Question.disableRemoteMethodByName('createChangeStream');

    // Validation
    validation(Question);

    // Utils
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
};
