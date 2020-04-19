import constants from 'node-constants';
const define = constants.definer(exports);

define('SLUG_PATTERN', /^[A-Za-z0-9.]+(?:-[A-Za-z0-9&.]+)*$/);
define('USERNAME_REGEX', /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/);
define('PASSWORD_REGEX', /^(?=.*[a-z0-9])[a-zA-Z\d@$!%*?&]{8,}$/);
define('FULLNAME_REGEX', /^[a-zA-Z\\s]+/);

define('MIN_LENGTH', 8);
define('MAX_LENGTH', 100);
define('MIN_USERNAME_LENGTH', 8);
define('MAX_USERNAME_LENGTH', 100);
define('MIN_BODY_LENGTH', 20);
define('MAX_BODY_LENGTH', 1000);
define('DESCRIPTION_RATE', 4); // 1/4 body
define('TITLE_MIN_LENGTH', 10);
define('TITLE_MAX_LENGTH', 250);

