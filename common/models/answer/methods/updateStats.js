import async from 'async';
import {VOTE_UP, VOTE_DOWN} from '../../../../configs/constants/serverConstant';

export default (Answer) => {
    Answer.updateStats = (answerId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const votesCount = (next) => {
            async.parallel({
                'upVotesCount': (cb) => {
                    Answer.votes.count({
                        modelId: answerId,
                        modelType: Answer.modelName,
                        action: VOTE_UP
                    }, (err, count) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, count);
                    });
                },
                'downVotesCount': (cb) => {
                    Answer.votes.count({
                        modelId: answerId,
                        modelType: Answer.modelName,
                        action: VOTE_DOWN
                    }, (err, count) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, count);
                    });
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                stats.upVotesCount = result.upVotesCount;
                stats.downVotesCount = result.downVotesCount;
                next();
            });
        };

        const reportsCount = (next) => {
            Answer.reports.count(answerId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.reportsCount = count;
                next();
            });
        };

        const methods = {};
        switch (options.model) {
            case Answer.app.model.Vote.modelName:
                methods['votesCount'] = votesCount;
                break;
            case Answer.app.model.Report.modelName:
                methods['reportsCount'] = reportsCount;
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
};
