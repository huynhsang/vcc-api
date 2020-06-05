import {MOST_ANSWERED, MOST_RECENT, MOST_VISITED, MOST_VOTED, NO_ANSWERS} from '../../../../configs/constants/serverConstant';

export const canEditQuestion = (user, question, callback) => {
    process.nextTick(() => {
        if (String(user.id) === String(question.ownerId)) {
            return callback(null, true);
        }
        callback(null, false);
    });
};

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
    let orConds = [{isPublic: true}];
    const conds = {
        disabled: false,
        removedItem: {
            exists: false
        }
    };
    if (data.keyword) {
        const pattern = new RegExp('.*' + data.keyword + '.*', 'i');
        conds.title = {like: pattern};
    }
    if (data.tagIds && data.tagIds.length > 0) {
        conds['tagList.id'] = {inq: data.tagIds};
    }
    if (data.ownerId) {
        conds['ownerId'] = data.ownerId;
    }
    if (data.categorySlug) {
        conds['categoryItem.slug'] = data.categorySlug;
    }
    if (data.answered !== undefined) {
        if (data.answered) {
            conds['answerCount'] = {gt: 0};
        } else {
            conds['answerCount'] = 0;
        }
    }
    if (data.meId) {
        if (data.mine) {
            conds['ownerId'] = data.meId;
        }
        if (data.askedToMe) {
            conds['supporterList.id'] = data.meId;
        }
        orConds = orConds.concat([{ownerId: data.meId}, {'supporterList.id': data.meId}]);
    }

    return {and: [conds, {or: orConds}]};
};

export const isRemovedQuestion = (question) => {
    return !!(!question || question.removedItem);
};

export const isActiveQuestion = (question) => {
    return !(!question || question.disabled || question.reportCount > 0);
};