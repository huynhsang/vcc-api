// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const loopback = require('loopback');
const boot = require('loopback-boot');
const path = require('path');

const app = module.exports = loopback();

app.start = function () {
    // start the web server
    return app.listen(function () {
        app.emit('started');
        const baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            const explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
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
