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

constant.SUBCATEGORY_TYPE = {
  LOCATION: 'location',
  NAME_OF_UNIVERSITY: 'name_of_university',
  FIELD_OF_STUDY: 'field_of_study',
  LEVEL: 'level',
  OTHER: 'other',
  NAME_OF_COMPANY: 'name_of_company',
};

constant.REPUTATION_ACTION = {
  ACCEPT: 'accept',
  DOWN_VOTE: 'down vote',
  UP_VOTE: 'up vote',
};

constant.REPUTATION_POINT = {
  ACCEPT: 15,
  DOWN_VOTE: -2,
  UP_VOTE: 10,
  POSITIVE_SUM: 12,
  NEGATIVE_SUM: -12,
};

module.exports = constant;
