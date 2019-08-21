require('@babel/register');
// const glob = require('glob');

// console.log(glob.sync('./common/**/*.+(js|json)'));
// console.log(glob.sync('./common/*/*.+(js|json)'));

// BOOT INFO
switch (process.env.NODE_ENV) {
    case 'production':
        console.log('*** VCNC API :: PRODUCTION MODE ***', process.pid);
        break;
    case 'staging':
        console.log('*** VCNC API :: STAGING MODE - STAGING SERVER ONLY ***', process.pid);
        break;
    default:
        console.log('*** VCNC API :: LOCAL/TEST MODE ***', process.pid);
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
