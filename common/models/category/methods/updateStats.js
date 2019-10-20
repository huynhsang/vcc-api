import async from 'async';

export default (Category) => {
    Category.updateStats = (categoryId, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        const stats = {};
        const questionsCount = (next) => {
            Category.app.models.Question.count({
                'categoryItem.id': categoryId,
                'disabled': false,
                'removedItem': {'exists': false}
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                stats.questionsCount = count;
                next();
            });
        };

        const methods = {};
        if (options.model === Category.app.models.Question.modelName) {
            methods['questionsCount'] = questionsCount;
        }

        if (Object.keys(methods).length === 0) {
            return callback();
        }

        async.auto(methods, (err) => {
            if (err) {
                return callback(err);
            }
            Category.update({id: categoryId}, stats, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };
};
