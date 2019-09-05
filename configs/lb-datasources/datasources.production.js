import emailDS from '../email/email-ds-config';
import storage from '../local-storage/local-storage';

module.exports = {
    'vccDS': {
        'host': 'localhost',
        'port': 3306,
        'url': 'mysql://root:aaAA11!!@localhost:3306/vcc?charset=utf8mb4&collation=utf8mb4_general_ci',
        'database': 'vcc',
        'password': 'aaAA11!!',
        'name': 'vccDS',
        'user': 'root',
        'connector': 'mysql',
        'dateStrings': true,
        'charset': 'utf8mb4',
        'collation': 'utf8mb4_general_ci'
    },
    emailDS,
    storage
};
