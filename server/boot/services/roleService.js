import _ from 'lodash';
import async from 'async';
import logger from '../../../utils/logger';
import * as appConstant from '../../../common/constants/appConstant';

const roleService = {};

/**
 * Init Roles (admin and user)
 * @param app: {Object} application context
 * @param callback: {Function} The callback function
 */
roleService.initRoles = function (app, callback) {
    const Role = app.models.Role;
    const ROLE_NAME = [appConstant.ROLE.ADMIN, appConstant.ROLE.USER];

    const queue = async.queue((roleName, next) => {
        Role.findOne({
            where: {
                name: roleName
            }
        }, (err, role) => {
            // The datasource produced an error!
            if (err) {
                return next(err);
            }

            // Q: Is the role existed?
            if (!role) {
                // A: No, It's not. Then create a new one
                Role.create({
                    name: roleName
                }, function (_err) {
                    if (_err) {
                        return next(_err);
                    }

                    logger.info('Successfully, Create a new role name ', roleName);
                    next();
                });
            } else {
                next();
            }
        });
    }, 2);

    let queueErr;
    // assign a callback
    queue.drain(() => {
        if (queueErr) {
            return callback(queueErr);
        }
        logger.info('Created roles');
        return callback();
    });

    // assign an error callback
    queue.error(callback);

    _.forEach(ROLE_NAME, (roleName) => {
        queue.push(roleName, (err) => {
            if (err && !queueErr) {
                queueErr = err;
            }
        });
    });
};

/**
 * Mapping new user to role
 * @param app: application context
 * @param user: a new user
 */
roleService.mappingRoleToUser = function (app, user) {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    let roleName = appConstant.ROLE.USER;

    if (user.realm.includes(appConstant.ROLE.ADMIN)) {
        roleName = appConstant.ROLE.ADMIN;
    }

    return new Promise(function (resolve, reject) {
        Role.findOne({
            where: {
                name: roleName
            }
        }, (err, role) => {
            if (err) reject(err);

            if (role) {
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: user.id
                }, function (_err, principal) {
                    if (_err) reject(_err);

                    logger.info('Created principal:', principal);
                    resolve(true);
                });
            } else {
                logger.error('Role Not Found!', roleName);
                resolve(false);
            }
        });
    });
};

/**
 * Init default account for admin
 * @param app: application context
 */
roleService.initDefaultAdmin = function (app) {
    const User = app.models.User;
    User.findOne({
        where: {
            email: appConstant.adminEmail,
            realm: appConstant.realm.admin
        }
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            logger.info('Starting to create default account for admin');
            User.create({
                avatar: 'avatar_path',
                createdBy: 'System',
                createdDate: new Date(),
                dateOfBirth: new Date(),
                email: appConstant.adminEmail,
                firstName: 'sang',
                lastName: 'huynh',
                isEnable: 1,
                lastModifiedBy: 'System',
                lastModifiedDate: new Date(),
                nationality: 'VietNam',
                realm: appConstant.realm.admin,
                emailVerified: true,
                password: 'vcc2019'
            }, function (_err, newUser) {
                if (_err) throw _err;

                if (newUser) {
                    logger.info('Created default account for admin:', newUser);
                    roleService.mappingRoleToUser(app, newUser);
                }
            });
        }
    });
};
module.exports = roleService;
