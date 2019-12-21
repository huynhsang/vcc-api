import accountHandler from './user/accountHandler';
import userUtils from './user/utils/userUtils';
import validation from './user/validation';
import updateStats from './user/methods/updateStats';
import register from './user/methods/register';
import countMethods from './user/methods/countMethods';

import disableRoutes from './user/disableRoutes';
import getProfileByIdRoute from './user/getProfileByIdRoute';
import updateProfileRoute from './user/updateProfileRoute';
import registerRoute from './user/registerRoute';

module.exports = function (user) {
    disableRoutes(user);

    // Validation
    validation(user);

    // Utils
    countMethods(user);
    userUtils(user);
    accountHandler(user);
    updateStats(user);
    register(user);

    // Route
    getProfileByIdRoute(user);
    updateProfileRoute(user);
    registerRoute(user);
};
