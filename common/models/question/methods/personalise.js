import async from 'async';
import {VOTED_FIELD} from '../../../../configs/constants/serverConstant';

export default (Question) => {
    Question.personalise = (userId, questions, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};
        if (!userId) {
            return callback(null, questions);
        }
        let data = questions;
        let isObject = false;
        if (!Array.isArray(questions)) {
            data = [questions];
            isObject = true;
        }
        if (data.length === 0) {
            return callback(null, questions);
        }
        const answersData = [];
        if (!options.excludeAnswer) {
            for (let i = 0, length = data.length; i < length; i++) {
                if (data[i] && data[i].bestAnswerItem) {
                    answersData.push(data[i].bestAnswerItem);
                }
            }
        }

        async.parallel({
            'votes': (next) => {
                Question.app.models.Vote.personaliseModels(userId, questions, Question.modelName, next);
            },
            'answers': (next) => {
                if (answersData.length === 0) {
                    return next(null, {});
                }
                Question.app.models.Answer.personalise(userId, answersData, next);
            }
        }, (err, result) => {
            if (err) {
                return callback(err);
            }
            const {votes, answers} = result;
            const answerObjs = {};
            for (let i = 0, len = answers.length; i < len; i++) {
                answerObjs[String(answers[i].id)] = answers[i];
            }

            for (let i = 0, len = data.length; i < len; i++) {
                data[i] = (typeof data[i].toObject === 'function') ? data[i].toObject(true, true, true) : data[i];
                data[i][VOTED_FIELD] = votes[String(data[i].id)];
                const aObject = answerObjs[String(data[i].bestAnswerItem.id)];
                if (data[i].bestAnswerItem && aObject) {
                    data[i].bestAnswerItem = aObject;
                }
            }

            callback(null, (isObject) ? data[0] : data);
        });
    };
};
