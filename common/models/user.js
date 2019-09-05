import accountHandler from './user/accountHandler';
import createUserRoute from './user/createUserRoute';
import getProfileByIdRoute from './user/getProfileByIdRoute';
import userUtils from './user/utils/userUtils';
import validation from './user/validation';

module.exports = function (user) {
    // Validation
    validation(user);

    // Utils
    userUtils(user);
    accountHandler(user);

    // Route
    createUserRoute(user);
    getProfileByIdRoute(user);
};
