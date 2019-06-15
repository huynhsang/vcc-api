'use strict';

let logger = require('./../../../utils/logger');
let formatter = require('./../../../utils/formatter');

module.exports = function(app) {
  // verified
  app.get('/verified', function(req, res) {
    formatter.jsonResponseSuccess(res, {});
  });

  // show password reset form
  app.get('/reset-password', function(req, res, next) {
    if (!req.query.accessToken) return res.sendStatus(401);
    res.render('passwordReset', {
      redirectUrl: '/api/users/reset-password?access_token=' +
        req.query.accessToken,
    });
  });
};
