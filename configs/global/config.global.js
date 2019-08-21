const config = {};

switch (process.env.NODE_ENV) {
    case 'production':
        config.SERVER_ADDRESS = 'vcnc.app';
        config.SERVER_PROTOCOL = 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = 3000;
        break;
    case 'staging':
        config.SERVER_ADDRESS = 'staging.vcnc.app';
        config.SERVER_PROTOCOL = 'https';
        config.SERVER_PORT = 443;
        config.APPLICATION_PORT = 3000;
        break;
    default:
        config.SERVER_ADDRESS = 'localhost';
        config.SERVER_PROTOCOL = 'http';
        config.SERVER_PORT = 3000;
        config.APPLICATION_PORT = 3000;
        break;
}

export default config;
