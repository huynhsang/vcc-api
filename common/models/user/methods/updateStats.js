/* global __ */
import async from 'async';
import {ObjectID} from 'mongodb';

export default (User) => {
    User.updateStats = ({id}, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const questionCount = (next) => {
            User.countQuestions(id, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.questionCount = count;
                next();
            });
        };

        const answerCount = (next) => {
            User.countAnswers(id, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.answerCount = count;
                next();
            });
        };

        const bestAnswers = (next) => {
            User.countBestAnswers(id, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.bestAnswers = count;
                next();
            });
        };

        const methods = {};
        switch (options.attribute) {
            case User.app.models.Question.modelName:
                methods['questionCount'] = questionCount;
                break;
            case User.app.models.Answer.modelName:
                methods['answerCount'] = answerCount;
                break;
            case 'bestAnswers':
                methods['bestAnswers'] = bestAnswers;
                break;
        }

        if (Object.keys(methods).length === 0) {
            return callback();
        }

        async.auto(methods, (err) => {
            if (err) {
                return callback(err);
            }
            User.update({id: id}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };

    User.increaseQuestionCount = (id, num, callback) => {
        const mongoConnector = User.getDataSource().connector;
        mongoConnector.collection(User.modelName).findAndModify(
            {
                _id: ObjectID(String(id))
            },
            [],
            {
                $inc: {
                    'questionCount': num
                }
            },
            {new: true}, (err, doc) => {
                if (err) {
                    return callback(err);
                }
                if (!doc || !doc.value) {
                    return callback(new Error(__('err.user.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new User(doc));
            }
        );
    };

    User.increaseAnswerCount = (id, num, callback) => {
        const mongoConnector = User.getDataSource().connector;
        mongoConnector.collection(User.modelName).findAndModify(
            {
                _id: ObjectID(String(id))
            },
            [],
            {
                $inc: {
                    'answerCount': num
                }
            },
            {new: true}, (err, doc) => {
                if (err) {
                    return callback(err);
                }
                if (!doc || !doc.value) {
                    return callback(new Error(__('err.user.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new User(doc));
            }
        );
    };
};
