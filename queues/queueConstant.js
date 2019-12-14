import constants from 'node-constants';
const define = constants.definer(exports);

// Exchanges
const DEFAULT_EXCHANGE_DIRECT = 'default_vcc_exchange_direct';
const DEFAULT_EXCHANGE_TOPIC = 'default_vcc_exchange_topic';
const DEFAULT_EXCHANGE_FANOUT = 'default_vcc_exchange_fanout';
define('DEFAULT_EXCHANGE_DIRECT', DEFAULT_EXCHANGE_DIRECT);
define('DEFAULT_EXCHANGE_TOPIC', DEFAULT_EXCHANGE_TOPIC);
define('DEFAULT_EXCHANGE_FANOUT', DEFAULT_EXCHANGE_FANOUT);
const DEFAULT_EXCHANGES = [
    {
        name: DEFAULT_EXCHANGE_DIRECT,
        type: 'direct'
    }, {
        name: DEFAULT_EXCHANGE_TOPIC,
        type: 'topic'
    }, {
        name: DEFAULT_EXCHANGE_FANOUT,
        type: 'fanout'
    }];
define('DEFAULT_EXCHANGES', DEFAULT_EXCHANGES);

// Queues name
define('SEND_MAIL_QUEUE', 'send_mail_queue');

define('DEFAULT_QUEUE_DELAY', 3000); // 3s
define('DEFAULT_QUEUE_ATTEMPTS', 3);
