import constants from 'node-constants';
const define = constants.definer(exports);

define('OK', 200);
define('CREATED', 201);
define('ACCEPTED', 202);
define('NON_AUTHORITATIVE_INFORMATION', 203);
define('NO_CONTENT', 204);
define('RESET_CONTENT', 205);
define('PARTIAL_CONTENT', 206);
define('MULTI_STATUS', 207);

define('MOVED_PERMANENTLY', 301);
define('MOVED_TEMPORARILY', 302);
define('NOT_MODIFIED', 304);

define('BAD_REQUEST', 400);
define('UNAUTHORIZED', 401);
define('PAYMENT_REQUIRED', 402);
define('FORBIDDEN', 403);
define('NOT_FOUND', 404);
define('METHOD_NOT_ALLOWED', 405);
define('NOT_ACCEPTABLE', 406);
define('PROXY_AUTHENTICATION_REQUIRED', 407);
define('REQUEST_TIMEOUT', 408);
define('CONFLICT', 409);
define('GONE', 410);
define('LENGTH_REQUIRED', 411);
define('PRECONDITION_FAILED', 412);
define('REQUEST_TOO_LONG', 413);
define('REQUEST_URI_TOO_LONG', 414);
define('UNSUPPORTED_MEDIA_TYPE', 415);
define('UNPROCESSABLE_ENTITY', 422);
define('TOO_MANY_REQUESTS', 429);

define('INTERNAL_SERVER_ERROR', 500);
define('NOT_IMPLEMENTED', 501);
define('BAD_GATEWAY', 502);
define('SERVICE_UNAVAILABLE', 503);
define('GATEWAY_TIMEOUT', 504);
define('HTTP_VERSION_NOT_SUPPORTED', 505);
