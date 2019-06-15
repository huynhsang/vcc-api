'use strict';

module.exports = {
  'restApiRoot': process.env.APPLICATION_REST_API_ROOT,
  'host': process.env.APPLICATION_HOST,
  'port': process.env.APPLICATION_PORT,
  'aclErrorStatus': 403,
  'remoting': {
    'context': false,
    'rest': {
      'handleErrors': false,
      'normalizeHttpPath': false,
      'xml': false,
    },
    'json': {
      'strict': false,
      'limit': '5mb',
    },
    'urlencoded': {
      'extended': true,
      'limit': '5mb',
    },
    'cors': false,
  },
};
