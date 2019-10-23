import {VOTE_DOWN, VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Answer) => {
    Answer.countUpVotes = (answerId, callback) => {
        Answer.app.models.Vote.count({
            modelId: answerId,
            modelType: Answer.modelName,
            action: VOTE_UP
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };

    Answer.countDownVotes = (answerId, callback) => {
        Answer.app.models.Vote.count({
            modelId: answerId,
            modelType: Answer.modelName,
            action: VOTE_DOWN
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };

    Answer.countReports = (answerId, callback) => {
        Answer.app.models.Report.count({
            modelId: answerId,
            modelType: Answer.modelName
        }, (err, count) => {
            if (err) {
                return callback(err);
            }
            callback(null, count);
        });
    };
};
