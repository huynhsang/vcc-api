import config from '../global/config.global';

module.exports = {
    restApiRoot: '/api',
    host: '0.0.0.0',
    port: config.APPLICATION_PORT,
    remoting: {
        context: false,
        rest: {
            handleErrors: false,
            normalizeHttpPath: false,
            xml: false
        },
        json: {
            strict: false,
            limit: '100kb'
        },
        urlencoded: {
            extended: true,
            limit: '100kb'
        },
        cors: false
    }
};
