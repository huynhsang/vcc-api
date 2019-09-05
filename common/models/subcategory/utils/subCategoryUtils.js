/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';

export default function (SubCategory) {
    /**
     * The method handles logic to increase or reduce property of subCategory by value
     * @param id: {Number} The subCategory Id
     * @param value: {Number} The number of increment (positive) or reduction (negative)
     * @param callback: {Function} The callback function
     */
    SubCategory.updateNumberOfQuestions = function (id, value, callback) {
        let transaction = null;
        const initTransaction = function (next) {
            SubCategory.beginTransaction({
                isolationLevel: SubCategory.Transaction.READ_COMMITTED
            }, (err, tx) => {
                if (err) {
                    return next(err);
                }
                transaction = tx;
                next();
            });
        };

        const findAndModify = function (next) {
            SubCategory.findById(id, {transaction}, (err, _subCategory) => {
                if (err) {
                    return next(err);
                }
                if (!_subCategory) {
                    return next(notFoundErrorHandler(__('err.SubCategory.notExists')));
                }
                const newValue = _subCategory.numberOfQuestions + value;
                _subCategory.updateAttribute('numberOfQuestions', newValue, {transaction}, (_err, _updated) => {
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
        ], (err, subCategory) => {
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
                callback(subCategory);
            });
        });
    };
}
