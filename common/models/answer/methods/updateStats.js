/* global __ */
import async from 'async';
import {ObjectID} from 'mongodb';

export default (Answer) => {
    Answer.updateStats = (answerId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const voteCount = (next) => {
            async.parallel({
                'upVoteCount': (cb) => {
                    Answer.countUpVotes(answerId, cb);
                },
                'downVoteCount': (cb) => {
                    Answer.countDownVotes(answerId, cb);
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
            Answer.countReports(answerId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.reportCount = count;
                next();
            });
        };

        const methods = {};
        switch (options.model) {
            case Answer.app.models.Vote.modelName:
                methods['voteCount'] = voteCount;
                break;
            case Answer.app.models.Report.modelName:
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
            Answer.update({id: answerId}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };

    Answer.increaseCount = (id, attribute, num, callback) => {
        const inc = {};
        inc[attribute] = num;
        const mongoConnector = Answer.getDataSource().connector;
        mongoConnector.collection(Answer.modelName).findAndModify(
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
                    return callback(new Error(__('err.answer.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new Answer(doc));
            }
        );
    };
};
