import async from 'async';
import * as shortid from 'shortid';
import approveAnswerRoute from './question/approveAnswerRoute';
import {errorHandler} from '../utils/modelHelpers';
import getDetailBySlugRoute from './question/getDetailBySlugRoute';
import getQuestionsRoute from './question/getQuestionsRoute';
import validation from './question/validation';
import getAnswersRoute from './question/getAnswersRoute';
import approveAnswer from './question/methods/approveAnswer';
import getQuestions from './question/methods/getQuestions';
import getQuestionBySlug from './question/methods/getQuestionBySlug';
import updateStats from './question/methods/updateStats';
import voteRoute from './question/voteRoute';

module.exports = function (Question) {
    // Disable loopback remote methods
    // Question.disableRemoteMethodByName('create');
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

    /**
     *
     * The method is responsible for handling logic before saving Question
     */
    Question.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;

        if (!ctx.isNewInstance) {
            delete data.createdBy;
        } else {
            data.shortId = shortid.generate();
            data.createdBy = ctx.options.accessToken.userId;
        }
        next();
    });

    /**
     * The method observe then run after create method is called
     */
    Question.afterRemote('create', function (ctx, question, next) {
        async.parallel({
            'updateCategory': (cb) => {
                const Category = Question.app.models.Category;
                Category.updateNumberOfQuestions(question.categorySlug, 1, cb);
            },
            'updateUser': (cb) => {
                const User = Question.app.models.user;
                User.updateAmountOfProperties(question.createdBy, 'numberOfQuestions', 1, cb);
            },
            'updateSubCategory': (cb) => {
                const SubCategory = Question.app.models.SubCategory;
                const tags = JSON.parse(question.tags);
                tags.forEach((tag, index) => {
                    SubCategory.updateNumberOfQuestions(tag.id, 1, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        if (index === tags.length - 1) {
                            cb();
                        }
                    });
                });
            }
        }, (err) => {
            if (err) {
                return next(errorHandler(err));
            }
            next();
        });
    });

    // Utils
    updateStats(Question);
    approveAnswer(Question);
    getQuestions(Question);
    getQuestionBySlug(Question);

    // Routes
    approveAnswerRoute(Question);
    getDetailBySlugRoute(Question);
    getQuestionsRoute(Question);
    getAnswersRoute(Question);
    voteRoute(Question);
};
