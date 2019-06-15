'use strict';

let utility = {};

utility.getFullDomain = function(app) {
  const protocol = process.env.SERVER_PROTOCOL || 'http';
  const host = process.env.SERVER_ADDRESS || (app && app.get('host')) ||
    'localhost';
  const port = process.env.SERVER_PORT || (app && app.get('port')) || 3000;

  let displayPort = ((protocol === 'http' && port === '80') ||
    (protocol === 'https' && port === '443')) ? '' : ':' + port;

  return protocol + '://' + host + displayPort;
};

module.exports = utility;
