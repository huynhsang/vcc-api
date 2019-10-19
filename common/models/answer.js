import validation from './answer/validation';
import createOrUpdateRoute from './answer/createOrUpdateRoute';
import updateStats from './answer/methods/updateStats';
import createAnswer from './answer/methods/createAnswer';
import editAnswer from './answer/methods/editAnswer';
import getAnswersByQuestion from './answer/methods/getAnswersByQuestion';

module.exports = function (Answer) {
    Answer.disableRemoteMethodByName('create');
    Answer.disableRemoteMethodByName('replaceOrCreate');

    // Validation
    validation(Answer);

    /**
     *
     * The method is responsible for handling logic before saving Answer
     */
    Answer.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;

        // Handling logic when Update
        if (!ctx.isNewInstance) {
            delete data.createdBy;
        } else {
            data.createdBy = ctx.options.accessToken.userId;
            next();
        }
    });

    // Utils
    updateStats(Answer);
    createAnswer(Answer);
    editAnswer(Answer);
    getAnswersByQuestion(Answer);

    // Routes
    createOrUpdateRoute(Answer);
};
