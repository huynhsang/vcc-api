import postAnswerRoute from './answer/postAnswerRoute';
import findAllByQuestionIdRoute from './answer/findAllByQuestionIdRoute';
import validation from './answer/validation';

module.exports = function (Answer) {
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

    // Routes
    findAllByQuestionIdRoute(Answer);
    postAnswerRoute(Answer);
};
