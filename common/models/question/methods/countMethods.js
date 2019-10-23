import {VOTE_DOWN, VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Question) => {
    Question.countUpVotes = (questionId, callback) => {
        Question.app.models.Vote.count({
            modelId: questionId,
            modelType: Question.modelName,
            action: VOTE_UP
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };

    Question.countDownVotes = (questionId, callback) => {
        Question.app.models.Vote.count({
            modelId: questionId,
            modelType: Question.modelName,
            action: VOTE_DOWN
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };

    Question.countReports = (questionId, callback) => {
        Question.app.models.Report.count({
            modelId: questionId,
            modelType: Question.modelName
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };

    Question.countAnswers = (questionId, callback) => {
        Question.app.models.Answer.count({
            questionId
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };
};
