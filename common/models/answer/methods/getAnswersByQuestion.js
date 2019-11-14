/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';
import {isActiveQuestion} from '../../question/utils/helper';

export default (Answer) => {
    Answer.getAnswersByQuestion = (questionId, filter = {}, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};

        const getQuestion = (next) => {
            if (!options.verify) {
                return next();
            }
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
                next();
            });
        };

        const queryAnswers = (next) => {
            filter.order = filter.order || 'id DESC';
            filter.where = filter.where || {};
            filter.where.questionId = questionId;
            filter.where.disabled = false;
            filter.include = [{
                relation: 'answerBy',
                scope: {
                    fields: ['id', 'avatar', 'firstName', 'lastName', 'questionCount',
                        'answerCount', 'bestAnswers', 'points', 'badgeItem']
                }
            }];

            async.parallel({
                'totalCount': (cb) => {
                    if (!options.totalCount) {
                        return cb(null, -1);
                    }
                    Answer.count(filter.where, cb);
                },
                'answers': (cb) => {
                    Answer.find(filter, cb);
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (result.totalCount === -1) {
                    delete result.totalCount;
                }
                next(null, result);
            });
        };

        async.waterfall([
            getQuestion,
            queryAnswers
        ], callback);
    };
};
