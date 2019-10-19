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
