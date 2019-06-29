'use strict';
let logger = require('../../utils/logger');
let service = require('../../server/boot/services/usersVoteQuestionsService');

module.exports = function(UsersVoteQuestions) {
  /**
   * Handling logic before create new Rating
   */
  UsersVoteQuestions.beforeRemote('create', function(ctx, instance, next) {
    logger.debug('Before create new UsersVoteQuestions');
    ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
      ctx.req.accessToken.userId;
    next();
  });

  /**
   * The method is responsible for handling logic after save a vote
   */
  UsersVoteQuestions.observe('after save', function(ctx, next) {
    logger.debug('After saved UsersVoteQuestions');

    let data = ctx.instance ? ctx.instance : ctx.data;
    service.handleAfterSave(UsersVoteQuestions.app, data, (err) => {
      if (err) next(err);
      else next();
    });
  });
};
