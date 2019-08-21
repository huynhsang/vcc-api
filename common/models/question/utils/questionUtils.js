/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../modelUtils/modelHelpers';

export default function (Question) {
    /**
     * The method handles logic to increase or reduce property of question by value
     * @param id: The question Id
     * @param propertyName: The property name need to update
     * @param value: The number of increment (positive) or reduction (negative)
     * @param callback: {Function} The callback function
     */
    Question.updateAmountOfProperties = function (id, propertyName, value, callback) {
        let transaction = null;
        const initTransaction = function (next) {
            Question.beginTransaction({
                isolationLevel: Question.Transaction.READ_COMMITTED
            }, (err, tx) => {
                if (err) {
                    return next(err);
                }
                transaction = tx;
                next();
            });
        };

        const findAndModify = function (next) {
            Question.findById(id, {transaction}, (err, _question) => {
                if (err) {
                    return next(err);
                }
                if (!_question) {
                    return next(notFoundErrorHandler(__('err.Question.notExists')));
                }
                const newValue = _question[propertyName] + value;
                _question.updateAttribute(propertyName, newValue, {transaction}, (_err, _updated) => {
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
        ], (err, question) => {
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
                callback(question);
            });
        });
    };
}
