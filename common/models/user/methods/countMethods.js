export default (User) => {
    User.countQuestions = (userId, callback) => {
        User.app.models.Question.count({
            ownerId: userId,
            disabled: false,
            removedItem: {
                exists: false
            }
        }, callback);
    };

    User.countAnswers = (userId, callback) => {
        User.app.models.Answer.count({
            ownerId: userId,
            disabled: false
        }, callback);
    };

    User.countBestAnswers = (userId, callback) => {
        User.app.models.Question.count({
            ownerId: userId,
            disabled: false,
            isTheBest: true
        }, callback);
    };


};
