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
        const questionCount = (next) => {
            User.app.models.Question.count({
                ownerId: userId,
                disabled: false,
                removedItem: {
                    exists: false
                }
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.questionCount = count;
                next();
            });
        };

        const answerCount = (next) => {
            User.app.models.Answer.count({
                ownerId: userId,
                disabled: false
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.answerCount = count;
                next();
            });
        };

        const bestAnswers = (next) => {
            User.app.models.Answer.count({
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
            case User.app.models.Question.modelName:
                methods['questionCount'] = questionCount;
                break;
            case User.app.models.Answer.modelName:
                methods['answerCount'] = answerCount;
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
                    'AnswerCount': num
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
