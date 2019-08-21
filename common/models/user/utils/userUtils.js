/* global __ */
import async from 'async';
import {accessDeniedErrorHandler, errorHandler, notFoundErrorHandler} from '../../../modelUtils/modelHelpers';
import * as appConstant from '../../../constants/appConstant';

export default function (User) {
    /**
     * Get current user from request
     * @param req: {Object} The request
     * @param callback: {Function} The callback function
     */
    User.getCurrentUser = function (req, callback) {
        const accessToken = req.accessToken;
        if (!accessToken) {
            callback(accessDeniedErrorHandler());
        } else {
            async.parallel({
                'lookupUser': (next) => {
                    User.findById(accessToken.userId, (err, _user) => {
                        if (err) {
                            return next(err);
                        }
                        if (!_user) {
                            return next(notFoundErrorHandler(__('err.user.notExists')));
                        }
                        next(null, _user);
                    });
                }
            }, (err, user) => {
                if (err) {
                    return callback(errorHandler(err));
                }
                callback(null, user);
            });
        }
    };

    /**
     * To verify current user has admin role or not
     * @param req: {Object} The request
     * @param callback: {Function} The callback function
     */
    User.isAdmin = function (req, callback) {
        const accessToken = req.accessToken;
        if (!accessToken) {
            callback(accessDeniedErrorHandler());
        }
        const getRole = function (next) {
            User.app.Role.findOne({
                where: {
                    name: appConstant.realm.admin
                }
            }, (err, role) => {
                if (err) {
                    return next(err);
                }
                if (!role) {
                    return next(notFoundErrorHandler(__('err.role.notExists')));
                }
                next(null, role);
            });
        };

        const verifyRole = function (role, next) {
            User.app.models.RoleMapping.findOne({
                where: {
                    principalId: accessToken.userId.toString(),
                    roleId: role.id
                }
            }, (err, roleMapping) => {
                if (err) {
                    return next(err);
                }
                if (roleMapping) {
                    return next(null, true);
                }
                next(null, false);
            });
        };

        async.waterfall([
            getRole,
            verifyRole
        ], (err, result) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(result);
        });
    };

    /**
     * The method handles logic to increase or reduce property of user by number
     * @param id: {Number} The user Id
     * @param propertyName: {String} The property name need to update
     * @param value: {Number} The number of increment (positive) or reduction (negative)
     * @param callback: {Function} The callback function
     */
    User.updateAmountOfProperties = function (id, propertyName, value, callback) {
        let transaction = null;
        const initTransaction = function (next) {
            User.beginTransaction({
                isolationLevel: User.Transaction.READ_COMMITTED
            }, (err, tx) => {
                if (err) {
                    return next(err);
                }
                transaction = tx;
                next();
            });
        };

        const findAndModify = function (next) {
            User.findById(id, {transaction}, (err, _user) => {
                if (err) {
                    return next(err);
                }
                if (!_user) {
                    return next(notFoundErrorHandler(__('err.User.notExists')));
                }
                const newValue = _user[propertyName] + value;
                _user.updateAttribute(propertyName, newValue, {transaction}, (_err, _updated) => {
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
        ], (err, user) => {
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
                callback(user);
            });
        });
    };

    /**
     * The method will update user points
     * @param reputation: {Object} The reputation
     * @param isNewInstance: {Boolean} Is new instance
     * @param callback: {Function} The callback function
     */
    User.updatePoint = function (reputation, isNewInstance, callback) {
        let point = reputation.point;
        if (!isNewInstance) {
            point = point > 0 ? appConstant.REPUTATION_POINT.POSITIVE_SUM :
                appConstant.REPUTATION_POINT.NEGATIVE_SUM;
        }
        User.updateAmountOfProperties(reputation.ownerId, 'points', point, (err) => {
            if (err) {
                return callback(err);
            }
            callback();
        });
    };
}
