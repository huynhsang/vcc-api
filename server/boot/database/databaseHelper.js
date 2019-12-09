import _ from 'lodash';
import async from 'async';
import logger from '../../../configs/logger';
import {logError} from '../../../common/services/loggerService';

const TABLE_LIST = [
    'Role',
    'RoleMapping',
    'user',
    'AccessToken',
    'Category',
    'Tag',
    'CategoryTag',
    'Education',
    'Experience',
    'Image',
    'Question',
    'Answer',
    'Reputation',
    'Notification',
    'Wallet',
    'Vote'
];
const databaseHelper = {};

databaseHelper.autoUpdateTables = function (app, callback) {
    const mysqlDS = app.dataSources.vccDS;

    const waitDBReady = function (next) {
        if (mysqlDS.connected) {
            next();
        } else {
            mysqlDS.once('connected', () => {
                next();
            });
        }
    };

    const syncDBTables = function (next) {
        const queue = async.queue(function (tableName, cb) {
            mysqlDS.autoupdate(tableName, (err) => {
                if (err) {
                    return cb(err);
                }
                logger.info(`Updated table ${tableName}`);
                cb();
            });
        }, 1);

        let queueErr;

        // assign a callback
        queue.drain(() => {
            if (queueErr) {
                return next(queueErr);
            }
            logger.info('Updated tables');
            next();
        });

        // assign an error callback
        queue.error(next);

        _.forEach(TABLE_LIST, (tableName) => {
            queue.push(tableName, (err) => {
                if (err && !queueErr) {
                    queueErr = err;
                }
            });
        });
    };

    async.waterfall([
        waitDBReady,
        syncDBTables
    ], (err) => {
        if (err) {
            logError(err);
            return callback(err);
        }
        callback();
    });
};

module.exports = databaseHelper;
