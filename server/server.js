'use strict';

let loopback = require('loopback');
let boot = require('loopback-boot');
let fs = require('fs');
let path = require('path');

let app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
let bootOptions = {
  'appRootDir': __dirname,
  'bootDirs': [
    path.resolve(__dirname, 'boot/database'),
    path.resolve(__dirname, 'boot/run'),
    path.resolve(__dirname, 'boot/api'),
  ],
};

if (process.env.NODE_ENV !== 'development') {
  let access = fs.createWriteStream(path.resolve(__dirname,
    '../logs/system_out.log'), {flags: 'a'});
  process.stdout.write = process.stderr.write = access.write.bind(access);
}

boot(app, bootOptions, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
