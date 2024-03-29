const config = {DEBUG: false};

switch (process.env.NODE_ENV) {
    case 'production':
        config.SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'vcnc.app';
        config.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = process.env.APPLICATION_PORT || 3000;
        break;
    case 'staging':
        config.SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'staging.vcnc.app';
        config.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = process.env.APPLICATION_PORT || 3000;
        break;
    default:
        config.SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
        config.SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
        config.SERVER_PORT = 8080;
        config.APPLICATION_PORT = process.env.APPLICATION_PORT || 3000;
        config.DEBUG = true;
        break;
}

// MongoDB configuration
config.MONGO_URL = process.env.MONGO_URL;

// Queue configuration
config.QUEUE_URL = process.env.QUEUE_URL;

config.EMAIL_ACCOUNT = {
    email: process.env.email || 'no.reply.vcnc@gmail.com',
    password: process.env.emailPassword || 'aaAA11!!'
};
config.SENDER_EMAIL = config.EMAIL_ACCOUNT.email;

const protocol = config.SERVER_PROTOCOL;
const port = config.SERVER_PORT;
const displayPort = ((protocol === 'http' && port === '80') ||
    (protocol === 'https' && port === '443')) ? '' : ':' + port;
config.FULL_DOMAIN = `${protocol}://${config.SERVER_ADDRESS}${displayPort}`;

export default config;
