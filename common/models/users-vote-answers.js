'use strict';
let logger = require('../../utils/logger');
let service = require('../../server/boot/services/usersVoteQuestionsService');

module.exports = function(UsersVoteAnswers) {
  /**
   * Handling logic before create new Rating
   */
  UsersVoteAnswers.beforeRemote('create', function(ctx, instance, next) {
    logger.debug('Before create new UsersVoteAnswers');
    ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
      ctx.req.accessToken.userId;
    next();
  });

  /**
   * The method is responsible for handling logic after save a vote
   */
  UsersVoteAnswers.observe('after save', function(ctx, next) {
    logger.debug('After saved UsersVoteAnswers');

    let data = ctx.instance ? ctx.instance : ctx.data;
    service.handleAfterSave(UsersVoteAnswers.app, data, (err) => {
      if (err) next(err);
      else next();
    });
  });
};
