const config = {};

switch (process.env.NODE_ENV) {
    case 'production':
        config.SERVER_ADDRESS = 'vcnc.app';
        config.SERVER_PROTOCOL = 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = 3000;
        config.DEBUG = false;
        break;
    case 'staging':
        config.SERVER_ADDRESS = 'staging.vcnc.app';
        config.SERVER_PROTOCOL = 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = 3000;
        config.DEBUG = false;
        break;
    default:
        config.SERVER_ADDRESS = 'localhost';
        config.SERVER_PROTOCOL = 'http';
        config.SERVER_PORT = 3000;
        config.APPLICATION_PORT = 3000;
        config.DEBUG = true;
        break;
}

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
