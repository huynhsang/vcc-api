// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import loopback from 'loopback';
import boot from 'loopback-boot';
import path from 'path';
import i18n from 'i18n';
import async from 'async';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import session from 'express-session';
import {logError, logInfo} from '../common/services/loggerService';
import {initQueue} from '../queues/rabbitMQ';
import Passport from '../configs/passport';
import {ensureLoggedIn} from 'connect-ensure-login';

logInfo(`*** VCNC API :: ${process.env.NODE_ENV} MODE ***, ${process.pid}`);

const app = module.exports = loopback();
let httpServer, queue;

const passport = new Passport(app);

i18n.configure({
    updateFiles: false,
    locales: ['en', 'en_VN'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../locales/lang'),
    register: global,
    objectNotation: true
});
i18n.setLocale('en_VN');

const API_ROLE = process.env.API_ROLE;
app.start = () => {
    const startQueue = (cb) => {
        initQueue(app, cb);
    };
    const startHttp = (cb) => {
        httpServer = app.listen(cb);
    };
    const methods = {
        queue: startQueue,
        http: startHttp
    };

    // default does both!
    switch (API_ROLE) {
        case 'queue':
            delete methods.http;
            break;
        case 'http':
            delete methods.queue;
            break;
    }

    async.parallel(methods, (err, result) => {
        if (err) {
            throw err;
        }
        queue = result.queue;

        // running
        if (methods.http) {
            const baseUrl = app.get('url').replace(/\/$/, '');
            logInfo(`**** Web server listening at: ${baseUrl} ****`);
            if (app.get('loopback-component-explorer')) {
                const explorerPath = app.get('loopback-component-explorer').mountPath;
                logInfo(`*** Browse your REST API at ${baseUrl}${explorerPath} ***`);
            }
        }
        if (methods.queue) {
            logInfo('**** Web API QUEUE running ****');
        }
        app.started = true;
        app.emit('started');
    });
};

const bootOptions = {
    appRootDir: __dirname,
    componentRootDir: path.join(__dirname, '../configs/lb-component-config'),
    middlewareRootDir: path.join(__dirname, '../configs/lb-middleware'),
    appConfigRootDir: path.join(__dirname, '../configs/lb-config'),
    dsRootDir: path.join(__dirname, '../configs/lb-datasources'),
    modelsRootDir: path.join(__dirname, '../configs/lb-model-config')
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, bootOptions, (err) => {
    if (err) throw err;

    app.set('view engine', 'ejs');
    // must be set to serve views properly when starting the app via `slc run` from
    // the project root
    app.set('views', path.resolve(__dirname, '../server/views'));

    passport.setup();

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();

    app.loaded = true;
    app.emit('loaded');
});

app.middleware('session:before', cookieParser('secret'));
app.middleware('session', session({
    secret: 'auth',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.get('/auth/account', ensureLoggedIn('/'), (req, res) => {
    res.set({
        'Content-type': 'application/json; charset=utf-8',
    });
    res.status(200).json({
        isSuccess: true,
        data: {
            user: req.user,
            accessToken: req.accessToken.id
        }
    });
});

// EXCEPTION HANDLER
process.on('uncaughtException', (err) => {
    logError(err, () => {
        process.exit(1);
    });
});

/* eslint no-process-exit:0 */
process.on('SIGINT', () => {
    const methods = [];
    if (httpServer && typeof httpServer.close === 'function') {
        methods.push((cb) => {
            logInfo('*** graceful shutdown HTTP ***');
            app.removeAllListeners('started');
            app.removeAllListeners('loaded');
            httpServer.close((err) => {
                cb(err);
            });
        });
    }
    if (queue && typeof queue.close === 'function') {
        methods.push((cb) => {
            logInfo('*** graceful shutdown Queue ***');
            queue.close(() => {
                cb();
            });
        });
    }

    async.parallel(methods, (err) => {
        process.exit(err ? 1 : 0);
    });
});
