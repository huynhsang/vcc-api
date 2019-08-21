import constants from 'node-constants';
const define = constants.definer(exports);

define('ACCESS_DENIED', 10);
define('PERMISSION_DENIED', 11);
define('RESOURCE_NOT_FOUND', 12);
define('INTERNAL_ERROR', 13);
define('RATE_LIMITED_EXCEEDED', 14);
define('MISSING_REQUIRED_HEADER', 15);
define('MISSING_REQUIRED_PARAMS', 16);
define('INVALID_HTTP_VERB', 17);
define('VALIDATION_ERROR', 18);

