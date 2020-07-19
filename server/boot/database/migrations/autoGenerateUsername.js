import async from 'async';
import * as shortid from 'shortid';
import * as _ from 'lodash';
import {ADMIN_REALM} from '../../../../configs/constants/serverConstant';

const migration = {
    version: 'v1'
};

migration.run = (app, callback) => {
    const User = app.models.user;
    const getNoUsernameUsers = (next) => {
        const mongoConnector = User.getDataSource().connector;
        mongoConnector.collection(User.modelName).aggregate([
            {
                $match: {
                    username: {
                        $exists: false
                    }
                }
            }
        ]).toArray((err, docs) => {
            if (err) {
                return next(err);
            }
            next(null, docs)
        });
    };

    const updateUsername = (users, next) => {
        if (!users || users.length === 0) {
            return next();
        }
        const queue = async.queue((user, cb) => {
            let prefix = 'user_';
            if (user.realm === ADMIN_REALM) {
                prefix = 'admin_';
            }
            User.update({'id': user._id}, {'username': `${prefix}${shortid.generate()}`}, (err) => {
                if (err) {
                    return cb(err);
                }
                cb();
            });
        }, 5);

        // assign a callback
        queue.drain(() => {
            return next();
        });

        // assign an error callback
        queue.error(next);

        _.forEach(users, (user) => {
            queue.push(user, () => {
            });
        });
    };

    async.waterfall([getNoUsernameUsers, updateUsername], callback);
};

module.exports = migration;
