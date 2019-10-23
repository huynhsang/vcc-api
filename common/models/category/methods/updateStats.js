/* global __ */
import async from 'async';
import {ObjectID} from 'mongodb';

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

    Category.increaseQuestionsCount = (id, num, callback) => {
        const mongoConnector = Category.getDataSource().connector;
        mongoConnector.collection(Category.modelName).findAndModify(
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
                    return callback(new Error(__('err.category.notExists')));
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new Category(doc));
            }
        );
    };
};
