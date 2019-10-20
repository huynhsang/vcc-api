import {MOST_VOTED, MOST_RECENT, MOST_ANSWERED, MOST_VISITED, NO_ANSWERS} from '../../../../configs/constants/serverConstant';
import {normalizeIncludeFields} from '../../../utils/filterUtils';

export default (Question) => {
    Question.getQuestions = (loggedInUser, filter, callback) => {
        filter.fields = normalizeIncludeFields(filter.fields);
        if (filter.fields) {
            filter.fields.id = true;
        }
        const conds = {
            disabled: false,
            removedItem: {
                exists: false
            }
        };
        filter.where = {...filter.where, ...conds};
        filter.include = [
            {
                relation: 'askedBy',
                scope: {
                    fields: ['id', 'avatar', 'firstName', 'lastName', 'questionsCount',
                        'answersCount', 'bestAnswers', 'points', 'badgeItem']
                }
            }
        ];
        if (loggedInUser && loggedInUser.id) {
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

        switch (filter.sort) {
            case MOST_VOTED:
                filter.order = ['upVotesCount DESC', 'created DESC'];
                break;
            case MOST_ANSWERED:
                filter.order = ['answersCount DESC', 'created DESC'];
                break;
            case MOST_VISITED:
                filter.order = ['viewsCount DESC', 'created DESC'];
                break;
            case NO_ANSWERS:
                filter.where.answersCount = 0;
                filter.order = ['created DESC'];
                break;
            case MOST_RECENT:
            default:
                filter.order = 'created DESC';
                break;
        }
        delete filter.sort;
        Question.find(filter, (err, questions) => {
            if (err) {
                return callback(err);
            }
            callback(null, questions);
        });
    };
};
