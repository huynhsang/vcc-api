import accountHandler from './user/accountHandler';
import createUserRoute from './user/createUserRoute';
import getProfileByIdRoute from './user/getProfileByIdRoute';
import userUtils from './user/utils/userUtils';

module.exports = function (user) {
    // Utils
    userUtils(user);
    accountHandler(user);

    // Route
    createUserRoute(user);
    getProfileByIdRoute(user);
};
