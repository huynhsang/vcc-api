/* global __ */
import async from 'async';
import {ObjectID} from 'mongodb';

export default (User) => {
    User.updateStats = (userId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const questionsCount = (next) => {
            User.questions.count({
                ownerId: userId,
                disabled: false,
                removedItem: {
                    exists: false
                }
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.questionsCount = count;
                next();
            });
        };

        const answersCount = (next) => {
            User.answers.count({
                ownerId: userId,
                disabled: false
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.answersCount = count;
                next();
            });
        };

        const bestAnswers = (next) => {
            User.answers.count({
                ownerId: userId,
                disabled: false,
                isTheBest: true
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.bestAnswers = count;
                next();
            });
        };

        const points = (next) => {
            const mongoConnector = User.getDataSource().connector;
            mongoConnector.collection(User.app.models.Reputation.modelName).aggregate([
                {
                    $match: {
                        receiverId: ObjectID(String(userId))
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$point'
                        }
                    }
                }
            ]).toArray((err, results) => {
                if (err) {
                    return next(err);
                }
                if (results.length > 0) {
                    stats.points = results[0].total;
                }
                next();
            });
        };

        const methods = {};
        switch (options.attribute) {
            case User.app.model.Question.modelName:
                methods['questionsCount'] = questionsCount;
                break;
            case User.app.model.Answer.modelName:
                methods['answersCount'] = answersCount;
                break;
            case 'bestAnswers':
                methods['bestAnswers'] = bestAnswers;
                methods['points'] = points;
                break;
            case 'points':
                methods['points'] = points;
                break;
        }

        if (Object.keys(methods).length === 0) {
            return callback();
        }

        async.auto(methods, (err) => {
            if (err) {
                return callback(err);
            }
            User.update({id: userId}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };

    User.increaseQuestionsCount = (id, num, callback) => {
        const mongoConnector = User.getDataSource().connector;
        mongoConnector.collection(User.modelName).findAndModify(
            {
                _id: ObjectID(String(id))
            },
            [],
            {
                $inc: {
                    'questionsCount': num
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

    User.increaseAnswersCount = (id, num, callback) => {
        const mongoConnector = User.getDataSource().connector;
        mongoConnector.collection(User.modelName).findAndModify(
            {
                _id: ObjectID(String(id))
            },
            [],
            {
                $inc: {
                    'AnswersCount': num
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
