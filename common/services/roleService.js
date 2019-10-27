/* global __ */
import {logInfo} from './loggerService';
import {notFoundErrorHandler} from '../utils/modelHelpers';
import {ADMIN_REALM, ADMIN_ROLE, USER_ROLE} from '../../configs/constants/serverConstant';

const roleService = {};

/**
 * Mapping new user to role
 * @param app: application context
 * @param user: a new user
 */
roleService.mappingRoleToUser = function (app, user) {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    let roleName = USER_ROLE;

    if (user.realm === ADMIN_REALM) {
        roleName = ADMIN_ROLE;
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

                    logInfo(`Created principal: ${principal}`);
                    resolve(true);
                });
            } else {
                reject(notFoundErrorHandler(__('err.role.notExists')));
            }
        });
    });
};

module.exports = roleService;
