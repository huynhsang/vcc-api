require('@babel/polyfill');
require('@babel/register');
// const glob = require('glob');

// console.log(glob.sync('./common/**/*.+(js|json)'));
// console.log(glob.sync('./common/*/*.+(js|json)'));

const server = require('./server/server');

if (server.loaded) {
    server.start();
} else {
    server.once('loaded', function () {
        server.start();
    });
}

module.exports = server;
