'use strict';

let constant = {};

constant.senderEmail = 'noreply@vcc.com';
constant.adminEmail = 'admin@vcc.com';

constant.realm = {
  admin: 'admin_app',
  user: 'user_app',
};

constant.ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

constant.NUMBER_OF = {
  VIEWS: 'numberOfViews',
  ANDROID_VIEWS: 'numberOfAndroidViews',
  IOS_VIEWS: 'numberOfIosViews',
  COMMENTS: 'numberOfComments',
  VOTES: 'numberOfVotes',
};

module.exports = constant;
