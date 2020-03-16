import async from 'async';
import {MOST_VOTED, MOST_RECENT, MOST_ANSWERED, MOST_VISITED, NO_ANSWERS} from '../../../../configs/constants/serverConstant';
import {getQuestionConds} from '../utils/helper';

export default (Question) => {
    Question.getQuestions = (filter, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};

        filter.where = getQuestionConds(filter);
        filter.include = [
            {
                relation: 'askedBy',
                scope: {
                    fields: ['id', 'avatar', 'firstName', 'lastName', 'questionCount',
                        'answerCount', 'bestAnswers', 'points', 'badgeItem']
                }
            }
        ];

        switch (filter.sort) {
            case MOST_VOTED:
                filter.order = ['upVoteCount DESC', 'created DESC'];
                break;
            case MOST_ANSWERED:
                filter.order = ['answerCount DESC', 'created DESC'];
                break;
            case MOST_VISITED:
                filter.order = ['viewCount DESC', 'created DESC'];
                break;
            case NO_ANSWERS:
                filter.where.answerCount = 0;
                filter.order = ['created DESC'];
                break;
            case MOST_RECENT:
            default:
                filter.order = 'created DESC';
                break;
        }
        delete filter.sort;

        async.parallel({
            'totalCount': (next) => {
                if (!options.totalCount) {
                    return next(null, -1);
                }
                Question.count(filter.where, next);
            },
            'questions': (next) => {
                Question.find(filter, next);
            }
        }, (err, result) => {
            if (err) {
                return callback(err);
            }
            if (result.totalCount === -1) {
                delete result.totalCount;
            }
            callback(null, result);
        });
    };
};
