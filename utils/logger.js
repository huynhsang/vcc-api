'use strict';

let bunyan = require('bunyan');
let path = require('path');

let getPath = function() {
  return path.resolve(__dirname, '../logs');
};

let logger;
if (process.env.NODE_ENV !== 'development') {
  logger = bunyan.createLogger({
    name: 'iamhcmcAPILogger',
    streams: [
      {
        level: 'error',
        path: getPath() + '/app.log', // log ERROR and above to a file
      }, {
        type: 'rotating-file',    // default level is info
        path: getPath() + '/app.log',
        period: '1d',   // daily rotation
        count: 30,        // keep 30 back copies
      },
    ],
  });
} else {
  logger = bunyan.createLogger({
    name: 'iamhcmcAPILogger',
    streams: [
      {
        level: 'debug',
        stream: process.stdout,       // log Debug and above to stdout
      }, {
        level: 'error',
        path: getPath() + '/app.log', // log ERROR and above to a file
      }, {
        type: 'rotating-file',    // default level is info
        path: getPath() + '/app.log',
        period: '1d',   // daily rotation
        count: 30,        // keep 30 back copies
      },
    ],
  });
}

process.on('uncaughtException', function(err) {
  logger.error('uncaughtException reason:',
    (err && err.stack) ? err.stack : err);
});

process.on('unhandledRejection', function(reason, p) {
  // Logging reason.stack gives the full stack trace of the error
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

module.exports = logger;
