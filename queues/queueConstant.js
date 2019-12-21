import constants from 'node-constants';
const define = constants.definer(exports);

// Exchanges
const DEFAULT_EXCHANGE_DIRECT = 'vcc_default_exchange_direct';
const DEFAULT_EXCHANGE_TOPIC = 'vcc_default_exchange_topic';
const DEFAULT_EXCHANGE_FANOUT = 'vcc_default_exchange_fanout';
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
define('SEND_MAIL_QUEUE', 'vcc_send_mail_queue');
define('DEFAULT_QUEUE', 'vcc_default_queue');
define('ACTIVITY_QUEUE', 'vcc_activity_queue');

define('DEFAULT_QUEUE_DELAY', 3000); // 3s
define('DEFAULT_QUEUE_ATTEMPTS', 3);
const TASK_PENDING = 'pending';
const TASK_ACTIVE = 'active';
const TASK_COMPLETE = 'complete';
const TASK_ERROR = 'error';
define('TASK_PENDING', TASK_PENDING);
define('TASK_ACTIVE', TASK_ACTIVE);
define('TASK_COMPLETE', TASK_COMPLETE);
define('TASK_ERROR', TASK_ERROR);

