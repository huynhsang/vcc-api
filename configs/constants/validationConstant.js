import constants from 'node-constants';
const define = constants.definer(exports);

define('SLUG_PATTERN', /^[A-Za-z0-9.]+(?:-[A-Za-z0-9.]+)*$/);
define('USERNAME_REGEX', /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/);
define('PASSWORD_REGEX', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/);
define('FULLNAME_REGEX', /^[a-zA-Z\\s]+/);

define('MIN_LENGTH', 8);
define('MAX_LENGTH', 48);
define('MIN_USERNAME_LENGTH', 8);
define('MAX_USERNAME_LENGTH', 24);

