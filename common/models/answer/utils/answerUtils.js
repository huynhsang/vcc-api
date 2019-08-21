/* global __ */

import async from 'async';
import {notFoundErrorHandler} from '../../../modelUtils/modelHelpers';

export default function (Answer) {
    /**
     * The method handles logic to increase or reduce property of answer by value
     * @param id: The answer Id
     * @param propertyName: The property name need to update
     * @param value: The number of increment (positive) or reduction (negative)
     * @param callback: {Function} The callback function
     */
    Answer.updateAmountOfProperties = function (id, propertyName, value, callback) {
        let transaction = null;
        const initTransaction = function (next) {
            Answer.beginTransaction({
                isolationLevel: Answer.Transaction.READ_COMMITTED
            }, (err, tx) => {
                if (err) {
                    return next(err);
                }
                transaction = tx;
                next();
            });
        };

        const findAndModify = function (next) {
            Answer.findById(id, {transaction}, (err, _answer) => {
                if (err) {
                    return next(err);
                }
                if (!_answer) {
                    return next(notFoundErrorHandler(__('err.answer.notExists')));
                }
                const newValue = _answer[propertyName] + value;
                _answer.updateAttribute(propertyName, newValue, {transaction}, (_err, _updated) => {
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
        ], (err, answer) => {
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
                callback(answer);
            });
        });
    };
}
