// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import loopback from 'loopback';
import boot from 'loopback-boot';
import path from 'path';
import i18n from 'i18n';
import {logError, logInfo} from '../common/services/loggerService';

logInfo(`*** VCNC API :: ${process.env.TARGET_ENV} MODE ***, ${process.pid}`);
switch (process.env.TARGET_ENV) {
    case 'production':
        require('dotenv').config({path: path.join(__dirname, '../.env.production')});
        break;
    case 'staging':
        require('dotenv').config({path: path.join(__dirname, '../.env.staging')});
        break;
    default:
        require('dotenv').config({path: path.join(__dirname, '../.env')});
        break;
}

const app = module.exports = loopback();

i18n.configure({
    updateFiles: false,
    locales: ['en', 'en_VN'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../locales/lang'),
    register: global,
    objectNotation: true
});
i18n.setLocale('en_VN');

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        const baseUrl = app.get('url').replace(/\/$/, '');
        logInfo(`Web server listening at: ${baseUrl}`);
        if (app.get('loopback-component-explorer')) {
            const explorerPath = app.get('loopback-component-explorer').mountPath;
            logInfo(`Browse your REST API at ${baseUrl}${explorerPath}`);
        }
    });
};

const bootOptions = {
    appRootDir: path.join(__dirname, '../server'),
    componentRootDir: path.join(__dirname, '../configs/lb-component-config'),
    middlewareRootDir: path.join(__dirname, '../configs/lb-middleware'),
    appConfigRootDir: path.join(__dirname, '../configs/lb-config'),
    dsRootDir: path.join(__dirname, '../configs/lb-datasources'),
    modelsRootDir: path.join(__dirname, '../configs/lb-model-config')
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, bootOptions, function (err) {
    if (err) throw err;

    app.set('view engine', 'ejs');
    // must be set to serve views properly when starting the app via `slc run` from
    // the project root
    app.set('views', path.resolve(__dirname, '../server/views'));

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();

    app.loaded = true;
    app.emit('loaded');
});

// EXCEPTION HANDLER
process.on('uncaughtException', function (err) {
    logError(err, function () {
        process.exit(1);
    });
});
