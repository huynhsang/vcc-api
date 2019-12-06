import accountHandler from './user/accountHandler';
import userUtils from './user/utils/userUtils';
import validation from './user/validation';
import updateStats from './user/methods/updateStats';

import disableRoutes from './user/disableRoutes';
import createUserRoute from './user/createUserRoute';
import getProfileByIdRoute from './user/getProfileByIdRoute';
import updateProfileRoute from './user/updateProfileRoute';

module.exports = function (user) {
    disableRoutes(user);

    // Validation
    validation(user);

    // Utils
    userUtils(user);
    accountHandler(user);
    updateStats(user);

    // Route
    createUserRoute(user);
    getProfileByIdRoute(user);
    updateProfileRoute(user);
};
