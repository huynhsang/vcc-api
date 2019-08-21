/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../modelUtils/modelHelpers';

export default function (Category) {
    /**
     * The method handles logic to increase or reduce property of category by number
     * @param slug: {String} The category slug
     * @param value: {Number} The number of increment (positive) or reduction (negative)
     * @param callback: {Function} The callback function
     */
    Category.updateNumberOfQuestions = function (slug, value, callback) {
        let transaction = null;
        const initTransaction = function (next) {
            Category.beginTransaction({
                isolationLevel: Category.Transaction.READ_COMMITTED
            }, (err, tx) => {
                if (err) {
                    return next(err);
                }
                transaction = tx;
                next();
            });
        };

        const findAndModify = function (next) {
            Category.findById(slug, {transaction}, (err, _category) => {
                if (err) {
                    return next(err);
                }
                if (!_category) {
                    return next(notFoundErrorHandler(__('err.category.notExists')));
                }
                const newValue = _category.numberOfQuestions + value;
                _category.updateAttribute('numberOfQuestions', newValue, {transaction}, (_err, _updated) => {
                    if (_err) {
                        return next(_err);
                    }
                    next(null, _updated);
                });
            });
        };

        async.waterfall([
            initTransaction,
            findAndModify
        ], (err, category) => {
            if (err) {
                if (transaction) {
                    transaction.rollback();
                }
                return callback(err);
            }
            transaction.commit((_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback(category);
            });
        });
    };
}
