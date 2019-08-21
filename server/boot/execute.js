import * as databaseHelper from './database/databaseHelper';
import * as roleService from './services/roleService';
import logger from './../../utils/logger';

module.exports = function (app) {
    databaseHelper.autoUpdateTables(app, (err) => {
        if (err) {
            process.exit(1);
        }
        logger.info('Executing init roles');
        roleService.initRoles(app, (_err) => {
            if (_err) {
                process.exit(1);
            }
            logger.info('Executing create default accounts');
            roleService.initDefaultAdmin(app);
        });
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
