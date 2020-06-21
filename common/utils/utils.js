import config from '../../configs/global/config.global';

export const buildWebURL = (urlPath) => {
    const displayPort = (
        (config.SERVER_PROTOCOL === 'http' && config.SERVER_PORT === 80) ||
        (config.SERVER_PROTOCOL === 'https' && config.SERVER_PORT === 443)
    ) ? '' : ':' + config.SERVER_PORT;

    return `${config.SERVER_PROTOCOL}://${config.SERVER_ADDRESS}${displayPort}${urlPath}`;
};
