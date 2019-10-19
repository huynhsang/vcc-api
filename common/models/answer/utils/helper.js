const canEditAnswer = (user, answer, callback) => {
    process.nextTick(() => {
        if (String(user.id) === String(answer.ownerId)) {
            return callback(null, true);
        }
        callback(null, false);
    });
};

const isActiveAnswer = (answer) => {
    return !(!answer || answer.disabled);
};

export {canEditAnswer, isActiveAnswer};
