import emailDS from '../email/email-ds-config';
import storage from '../local-storage/local-storage';
import config from '../global/config.global';

module.exports = {
    'vccDS': {
        'name': 'vccDS',
        'connector': 'mongodb',
        'url': config.MONGO_URL,
        'debug': false,
        'auto_reconnect': true
    },
    emailDS,
    storage
};
