import async from 'async';

export default (Question) => {
    Question.updateStats = (questionId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const answersCount = (next) => {
            Question.answers.count(questionId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.answersCount = count;
            });
        };

        const votesCount = (next) => {
            Question.votes.count(questionId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.votesCount = count;
            });
        };

        const reportsCount = (next) => {
            Question.reports.count(questionId, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.reportsCount = count;
                next();
            });
        };

        const methods = {};
        switch (options.model) {
            case Question.app.models.Answer.modelName:
                methods['answersCount'] = answersCount;
                break;
            case Question.app.models.Vote.modelName:
                methods['votesCount'] = votesCount;
                break;
            case Question.app.model.Report.modelName:
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
            Question.update({id: questionId}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };
};
