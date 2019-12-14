require('@babel/polyfill');
require('@babel/register');
// const glob = require('glob');

// console.log(glob.sync('./common/**/*.+(js|json)'));
// console.log(glob.sync('./common/*/*.+(js|json)'));
const path = require('path');
switch (process.env.NODE_ENV) {
    case 'production':
        require('dotenv').config({path: path.join(__dirname, './.env.production')});
        break;
    case 'staging':
        require('dotenv').config({path: path.join(__dirname, './.env.staging')});
        break;
    default:
        require('dotenv').config({path: path.join(__dirname, './.env')});
        break;
}

const server = require('./server/server');

if (server.loaded) {
    server.start();
} else {
    server.once('loaded', function () {
        server.start();
    });
}

module.exports = server;
