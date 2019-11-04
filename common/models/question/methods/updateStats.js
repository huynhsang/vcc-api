/* global __ */
import async from 'async';
import {ObjectID} from 'mongodb';

export default (Question) => {
    Question.updateStats = (questionId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const answerCount = (next) => {
            Question.countAnswers(questionId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.answerCount = count;
            });
        };

        const voteCount = (next) => {
            async.parallel({
                'upVoteCount': (cb) => {
                    Question.countUpVotes(questionId, cb);
                },
                'downVoteCount': (cb) => {
                    Question.countDownVotes(questionId, cb);
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                stats.upVoteCount = result.upVoteCount;
                stats.downVoteCount = result.downVoteCount;
                next();
            });
        };

        const reportCount = (next) => {
            Question.countReports(questionId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.reportCount = count;
                next();
            });
        };

        const methods = {};
        switch (options.model) {
            case Question.app.models.Answer.modelName:
                methods['answerCount'] = answerCount;
                break;
            case Question.app.models.Vote.modelName:
                methods['voteCount'] = voteCount;
                break;
            case Question.app.models.Report.modelName:
                methods['reportCount'] = reportCount;
                break;
            default:
                break;
        }

        if (Object.keys(methods).length === 0) {
            return callback();
        }

        async.auto(methods, (err) => {
            if (err) {
                return callback(err);
            }
            Question.update({id: questionId}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };

    Question.increaseAnswerCount = (id, num, callback) => {
        const mongoConnector = Question.getDataSource().connector;
        mongoConnector.collection(Question.modelName).findAndModify(
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
                    return callback(new Error(__('err.question.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new Question(doc));
            }
        );
    };

    Question.increaseCount = (id, attribute, num, callback) => {
        const inc = {};
        inc[attribute] = num;
        const mongoConnector = Question.getDataSource().connector;
        mongoConnector.collection(Question.modelName).findAndModify(
            {
                _id: ObjectID(String(id))
            },
            [],
            {
                $inc: inc
            },
            {new: true}, (err, doc) => {
                if (err) {
                    return callback(err);
                }
                if (!doc || !doc.value) {
                    return callback(new Error(__('err.question.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new Question(doc));
            }
        );
    };
};
