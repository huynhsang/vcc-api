import {VOTED_FIELD} from '../../../../configs/constants/serverConstant';

export default (Answer) => {
    Answer.personalise = (userId, answers, callback) => {
        if (!userId || !answers) {
            return callback(null, answers);
        }

        let isObject = false;
        let data = answers;
        if (!Array.isArray(answers)) {
            data = [answers];
            isObject = true;
        }
        if (data.length === 0) {
            return callback(null, answers);
        }
        Answer.app.models.Vote.personaliseModels(userId, answers, Answer.modelName, (err, votedAnswers) => {
            if (err) {
                return callback(err);
            }
            for (let i = 0, length = data.length; i < length; i++) {
                data[i] = (typeof data[i].toObject === 'function') ? data[i].toObject(false, true, true) : data[i];
                data[i][VOTED_FIELD] = votedAnswers[String(data[i].id)];
            }
            callback(null, (isObject) ? data[0] : data);
        });
    };
};
