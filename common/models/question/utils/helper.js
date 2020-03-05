import {MOST_ANSWERED, MOST_RECENT, MOST_VISITED, MOST_VOTED, NO_ANSWERS} from '../../../../configs/constants/serverConstant';

const canEditQuestion = (user, question, callback) => {
    process.nextTick(() => {
        if (String(user.id) === String(question.ownerId)) {
            return callback(null, true);
        }
        callback(null, false);
    });
};

const isActiveQuestion = (question) => {
    if (!question || question.disabled || question.removedItem) {
        return false;
    }
    return true;
};

export {canEditQuestion, isActiveQuestion};

export const getQuestionOrder = (sort) => {
    switch (sort) {
        case MOST_VOTED:
            return ['upVoteCount DESC', 'created DESC'];
        case MOST_ANSWERED:
            return ['answerCount DESC', 'created DESC'];
        case MOST_VISITED:
            return ['viewCount DESC', 'created DESC'];
        case NO_ANSWERS:
            return ['created DESC'];
        case MOST_RECENT:
        default:
            return ['created DESC'];
    }
};
