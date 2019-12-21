import async from 'async';

export default (Answer) => {
    Answer.updateStats = ({id}, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const voteCount = (next) => {
            async.parallel({
                'upVoteCount': (cb) => {
                    Answer.countUpVotes(id, cb);
                },
                'downVoteCount': (cb) => {
                    Answer.countDownVotes(id, cb);
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
            Answer.countReports(id, (err, count) => {
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
            Answer.update({id}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };
};
