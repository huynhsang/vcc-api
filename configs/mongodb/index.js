/* eslint no-unreachable:0 */
const configuration = {
    testDB: `mongodb://${(process.env.DOCKER_ENV || '127.0.0.1')}:27017/vccTest?connectTimeoutMS=30000`,
    devDB: `mongodb://${(process.env.DOCKER_ENV || '127.0.0.1')}:27017/vcc?connectTimeoutMS=30000`
};

const loadConfig = function () {
    if (process.env.NODE_ENV === 'test') {
        return configuration.testDB;
    } else {
        return configuration.devDB;
    }
};

export {loadConfig};
