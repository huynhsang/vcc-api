/* global __ */
import loopback from 'loopback';
import {logInfo} from './loggerService';
import {notFoundErrorHandler} from '../utils/modelHelpers';
import {ADMIN_REALM, ADMIN_ROLE, USER_ROLE} from '../../configs/constants/serverConstant';

class RoleService {
    /**
     * Mapping new user to role
     * @param user: a new user
     * @param callback: callback function
     */
    mappingRoleToUser (user, callback) {
        if (!callback) {
            callback = () => {};
        }
        const Role = loopback.getModel('Role');
        const RoleMapping = loopback.getModel('RoleMapping');

        let roleName = USER_ROLE;

        if (user.realm === ADMIN_REALM) {
            roleName = ADMIN_ROLE;
        }

        Role.findOne({
            where: {
                name: roleName
            }
        }, (err, role) => {
            if (err) return callback(err);

            if (role) {
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: user.id
                }, (_err, principal) => {
                    if (_err) return callback(_err);

                    logInfo(`Created principal: ${principal}`);
                    callback(null, true);
                });
            } else {
                callback(notFoundErrorHandler(__('err.role.notExists')));
            }
        });
    }
}

export default new RoleService();
