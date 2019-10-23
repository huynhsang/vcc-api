/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../../question/utils/helper';

export default (Answer) => {
    Answer.getAnswersByQuestion = (questionId, loggedInUser, filter, callback) => {
        const getQuestion = (next) => {
            Answer.app.models.Question.findById(questionId, {
                fields: ['id', 'disabled', 'removedItem']
            }, (err, question) => {
                if (err) {
                    return next(err);
                }
                if (!question) {
                    return next(notFoundErrorHandler(__('err.question.notExists')));
                }
                if (!isActiveQuestion(question)) {
                    return next(new Error(__('err.question.notActive')));
                }
                next(null, question);
            });
        };

        const getAnswers = (question, next) => {
            filter.order = filter.order || 'id DESC';
            filter.where = filter.where || {};
            filter.where.questionId = question.id;
            filter.where.disabled = false;
            filter.include = [{
                relation: 'answerBy',
                scope: {
                    fields: ['id', 'avatar', 'firstName', 'lastName', 'questionsCount',
                        'answersCount', 'bestAnswers', 'points', 'badgeItem']
                }
            }];

            if (loggedInUser) {
                filter.include.push({
                    relation: 'votes',
                    scope: {
                        where: {
                            ownerId: loggedInUser.id
                        },
                        limit: 1
                    }
                });
            }
            Answer.find(filter, (err, answers) => {
                if (err) {
                    return next(err);
                }
                next(null, answers);
            });
        };

        async.waterfall([
            getQuestion,
            getAnswers
        ], (err, answers) => {
            if (err) {
                return callback(err);
            }
            callback(null, answers);
        });
    };
};
