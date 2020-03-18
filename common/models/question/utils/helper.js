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

export const getQuestionConds = (data) => {
    const where = {
        disabled: false,
        removedItem: {
            exists: false
        }
    };
    if (data.keyword) {
        const pattern = new RegExp('.*' + data.keyword + '.*', 'i');
        where.title = {like: pattern};
        delete data.keyword;
    }
    if (data.tagIds && data.tagIds.length > 0) {
        where['tagList.id'] = {inq: data.tagIds};
        delete data.tagIds;
    }
    if (data.ownerId) {
        where['ownerId'] = data.ownerId;
        delete data.ownerId;
    }
    if (data.categorySlug) {
        where['categoryItem.slug'] = data.categorySlug;
        delete data.categorySlug;
    }
    if (data.answered !== undefined) {
        if (data.answered) {
            where['answerCount'] = {gt: 0}
        } else {
            where['answerCount'] = 0
        }
    }
    if (data.meId) {
        if (data.mine) {
            where['ownerId'] = data.meId;
            delete data.mine;
        }
        if (data.askedToMe) {
            where['supporterList.id'] = data.meId;
            delete data.askedToMe;
        }
        delete data.mine;
    }
    return where;
};
