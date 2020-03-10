import async from 'async';
import {MOST_VOTED, MOST_RECENT, MOST_ANSWERED, MOST_VISITED, NO_ANSWERS} from '../../../../configs/constants/serverConstant';

export default (Question) => {
    const buildWhere = (filter) => {
        const where = {
            disabled: false,
            removedItem: {
                exists: false
            }
        };
        if (filter.keyword) {
            const pattern = new RegExp('.*' + filter.keyword + '.*', 'i');
            where.title = {like: pattern};
            delete filter.keyword;
        }
        if (filter.tagIds && filter.tagIds.length > 0) {
            where['tagList.id'] = {inq: filter.tagIds};
            delete filter.tagIds;
        }
        if (filter.ownerId) {
            where['ownerId'] = filter.ownerId;
            delete filter.ownerId;
        }
        return where;
    };
    Question.getQuestions = (filter, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};

        filter.where = buildWhere(filter);
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
