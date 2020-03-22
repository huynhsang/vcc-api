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
    const orConds = [{isPublic: true}];
    const conds = {
        disabled: false,
        removedItem: {
            exists: false
        }
    };
    if (data.keyword) {
        const pattern = new RegExp('.*' + data.keyword + '.*', 'i');
        conds.title = {like: pattern};
        delete data.keyword;
    }
    if (data.tagIds && data.tagIds.length > 0) {
        conds['tagList.id'] = {inq: data.tagIds};
        delete data.tagIds;
    }
    if (data.ownerId) {
        conds['ownerId'] = data.ownerId;
        delete data.ownerId;
    }
    if (data.categorySlug) {
        conds['categoryItem.slug'] = data.categorySlug;
        delete data.categorySlug;
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
            delete data.mine;
        }
        if (data.askedToMe) {
            conds['supporterList.id'] = data.meId;
            delete data.askedToMe;
        }
        orConds.push({
            and: [
                {
                    isPublic: false
                },
                {
                    or: [
                        {
                            ownerId: data.meId
                        },
                        {
                            'supporterList.id': data.meId
                        }
                    ]
                }
            ]
        });
        delete data.meId;
    }

    return {and: [{...conds}, {or: orConds}]};
};
