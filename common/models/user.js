import accountHandler from './user/accountHandler';
import userUtils from './user/utils/userUtils';
import validation from './user/validation';
import updateStats from './user/methods/updateStats';
import register from './user/methods/register';
import countMethods from './user/methods/countMethods';
import getRoles from './user/methods/getRoles';

import disableRoutes from './user/disableRoutes';
import _GetProfileById from './user/routes/_GetProfileById';
import _UpdateProfile from './user/routes/_UpdateProfile';
import _Register from './user/routes/_Register';
import _GetMyAccount from './user/routes/_GetMyAccount';
import _VerifyEmail from './user/routes/_VerifyEmail';
import _GetUsers from './user/routes/_GetUsers';

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
    getRoles(user);

    // Route
    _GetUsers(user);
    _GetProfileById(user);
    _UpdateProfile(user);
    _Register(user);
    _GetMyAccount(user);
    _VerifyEmail(user);
};
