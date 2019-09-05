import async from 'async';
import * as shortid from 'shortid';
import questionUtils from './question/utils/questionUtils';
import approveAnswerRoute from './question/approveAnswerRoute';
import {errorHandler} from '../utils/modelHelpers';
import getQuestionDetailBySlugRoute from './question/getQuestionDetailBySlugRoute';
import getQuestionsRoute from './question/getQuestionsRoute';
import validation from './question/validation';

module.exports = function (Question) {
    // Validation
    validation(Question);

    /**
     *
     * The method is responsible for handling logic before saving Question
     */
    Question.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;

        if (!ctx.isNewInstance) {
            delete data.created;
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
                    SubCategory.updateNumberOfQuestions(tag.id, 'numberOfQuestions', 1, (err) => {
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
    questionUtils(Question);

    // Routes
    approveAnswerRoute(Question);
    getQuestionDetailBySlugRoute(Question);
    getQuestionsRoute(Question);
};
