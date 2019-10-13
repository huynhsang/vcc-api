import emailDS from '../email/email-ds-config';
import storage from '../local-storage/local-storage';
import {loadConfig} from '../mongodb';

const dburi = loadConfig();
module.exports = {
    'vccDS': {
        'name': 'vccDS',
        'connector': 'mongodb',
        'url': dburi,
        'debug': false,
        'server': {
            'auto_reconnect': true,
            'reconnectTries': 100,
            'reconnectInterval': 1000
        }
    },
    emailDS,
    storage
};
