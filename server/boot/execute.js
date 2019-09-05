import async from 'async';
import * as databaseHelper from './database/databaseHelper';
import dataInitialization from './database/dataInitialization';
import {logError} from '../../common/services/loggerService';

module.exports = function (app) {
    async.waterfall([
        (next) => {
            databaseHelper.autoUpdateTables(app, next);
        },
        (next) => {
            dataInitialization(app, next);
        }
    ], (err) => {
        if (err) {
            logError(err);
            process.exit(1);
        }
    });

    // Routes
    // verified
    app.get('/verified', function (req, res) {
        res.render('verified');
    });

    // show password reset form
    app.get('/reset-password', function (req, res, next) {
        if (!req.query.accessToken) return res.sendStatus(401);
        res.render('passwordReset', {
            redirectUrl: '/api/users/reset-password?access_token=' +
                req.query.accessToken
        });
        next();
    });
};
