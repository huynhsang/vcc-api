import async from 'async';
import * as _ from 'lodash';
import accounts from './data/accounts';
import {ADMIN_REALM, ADMIN_ROLE, USER_ROLE} from '../../../configs/constants/serverConstant';
import {logInfo} from '../../../common/services/loggerService';

export default function (app, callback) {
    const initRoles = function (next) {
        const Role = app.models.Role;
        const ROLE_NAME = [ADMIN_ROLE, USER_ROLE];

        const queue = async.queue((roleName, cb) => {
            Role.findOrCreate({
                where: {
                    name: roleName
                }
            }, {
                name: roleName
            }, (err, instance, created) => {
                if (err) {
                    return cb(err);
                }
                if (created) {
                    logInfo(`Successfully, Create a new role name ${instance.name}`);
                }
                cb();
            });
        }, 1);

        let queueErr;
        // assign a callback
        queue.drain(() => {
            if (queueErr) {
                return next(queueErr);
            }
            logInfo('Created roles');
            return next();
        });

        // assign an error callback
        queue.error(next);

        _.forEach(ROLE_NAME, (roleName) => {
            queue.push(roleName, (err) => {
                if (err && !queueErr) {
                    queueErr = err;
                }
            });
        });
    };

    const createDefaultAccounts = function (next) {
        const User = app.models.user;
        const queue = async.queue((account, cb) => {
            account.realm = ADMIN_REALM;
            User.findOrCreate({
                where: {
                    email: account.email
                }
            }, account, (err, instance, created) => {
                if (err) {
                    return cb(err);
                }
                if (created) {
                    logInfo(`Created an admin: ${account.email}`);
                }
                cb();
            });
        }, 1);

        let queueErr;
        // assign a callback
        queue.drain(() => {
            if (queueErr) {
                return next(queueErr);
            }
            logInfo('Created default accounts');
            return next();
        });

        // assign an error callback
        queue.error(next);

        _.forEach(accounts, (account) => {
            queue.push(account, (err) => {
                if (err && !queueErr) {
                    queueErr = err;
                }
            });
        });
    };

    async.waterfall([
        initRoles,
        createDefaultAccounts
    ], (err) => {
        if (err) {
            return callback(err);
        }
        callback();
    });
};
