import constants from 'node-constants';
const define = constants.definer(exports);

define('ADMIN_ROLE', 'admin');
define('USER_ROLE', 'user');
define('ADMIN_REALM', 'admin_realm');
define('USER_REALM', 'user_realm');

const VOTE_UP = 'up';
const VOTE_DOWN = 'down';
define('VOTE_UP', VOTE_UP);
define('VOTE_DOWN', VOTE_DOWN);
define('VOTE_ACTIONS', [VOTE_UP, VOTE_DOWN]);
define('VOTE_TYPES', ['Answer', 'Question']);

// Reputation
define('APPROVE', 'approve');

define('MIN_BODY_LENGTH', 20);
define('MAX_BODY_LENGTH', 10000);
define('DESCRIPTION_RATE', 4); // 1/4 body
define('TITLE_MIN_LENGTH', 10);
define('TITLE_MAX_LENGTH', 250);

// Filter constants
define('MAX_PAGE_SIZE', 100);
define('DEFAULT_PAGE_SIZE', 25);
const MOST_VOTED = 'highVote';
const MOST_RECENT = 'recent';
const MOST_ANSWERED = 'mostAnswered';
const MOST_VISITED = 'mostVisited';
define('MOST_VOTED', MOST_VOTED);
define('MOST_RECENT', MOST_RECENT);
define('MOST_ANSWERED', MOST_ANSWERED);
define('MOST_VISITED', MOST_VISITED);
define('SORT_QUESTION_CRITERIA', [MOST_VOTED, MOST_RECENT, MOST_ANSWERED, MOST_VISITED]);
define('SORT_TAGS_CRITERIA', ['popular', MOST_RECENT]);
define('SORT_USERS_CRITERIA', ['point']);
define('SUPPORTER_FIELDS', ['id', 'email', 'firstName', 'lastName', 'nationality']);

// Personalise Constant
define('VOTED_FIELD', 'voted');

// Email types
define('VERIFICATION_EMAIL', 'verification_email');

// Tag Constants
define('TAG_USED_FOR', ['post', 'question']);
