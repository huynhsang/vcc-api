import constants from 'node-constants';
const define = constants.definer(exports);

define('SLUG_PATTERN', /^[A-Za-z0-9.]+(?:-[A-Za-z0-9.]+)*$/);
