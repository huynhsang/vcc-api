/* global __ */
import async from 'async';
import {accessDeniedErrorHandler, errorHandler, notFoundErrorHandler} from '../../../utils/modelHelpers';
import serverConstant from '../../../../configs/constants/serverConstant';

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
                    name: serverConstant.ADMIN_ROLE
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
            callback(null, result);
        });
    };
}
