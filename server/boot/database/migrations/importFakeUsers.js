import fs from 'fs';
import async from 'async';
import parse from 'csv-parse';
import path from 'path';
import {USER_REALM} from '../../../../configs/constants/serverConstant';
import {logInfo} from '../../../../common/services/loggerService';
import roleService from '../../../../common/services/roleService';

const migration = {
    version: 'v1'
};

migration.run = (app, callback) => {
    const User = app.models.user;
    const FILE_PATH = path.resolve(__dirname, '../data/fake_users_v1_02-05-2020.csv');

    const insertUser = (account, next) => {
        account.realm = USER_REALM;
        account.nationality = 'Viet Nam';
        account.emailVerified = true;
        User.findOrCreate({
            where: {
                email: account.email
            }
        }, account, (err, instance, created) => {
            if (err) {
                return next(err);
            }
            if (created) {
                logInfo(`Created an User: ${account.email}`);
                roleService.mappingRoleToUser(instance);
            }
            next();
        });
    };

    const parser = parse({delimiter: ','}, (err, data) => {
        async.eachOfSeries(data, (line, index, next) => {
            if (index < 1 || line[0].trim().length === 0) {
                return next();
            }

            const account = {
                firstName: line[0],
                lastName: line[1],
                email: line[2],
                password: line[3]
            };
            insertUser(account, next);
        }, callback);
    });

    fs.createReadStream(FILE_PATH).pipe(parser);
};

module.exports = migration;
