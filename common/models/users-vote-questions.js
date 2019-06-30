'use strict';
let logger = require('../../utils/logger');
let service = require('../../server/boot/services/usersVoteQuestionsService');

module.exports = function(UsersVoteQuestions) {
  /**
   * Handling logic before create new Vote
   */
  UsersVoteQuestions.beforeRemote('create', function(ctx, instance, next) {
    logger.debug('Before create new UsersVoteQuestions');
    ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
      ctx.req.accessToken.userId;
    next();
  });

  /**
   * The method is responsible for handling logic before save a vote
   */
  UsersVoteQuestions.observe('before save', function(ctx, next) {
    logger.debug('Before save UsersVoteQuestions');

    if (!ctx.isNewInstance) {
      let data = ctx.instance ? ctx.instance : ctx.data;
      service.findOneById(UsersVoteQuestions, data.id, (err, instance) => {
        if (err) return next(err);
        if (!instance) return next(new Error('Not found!'));
        data.isPositiveVote = !instance.isPositiveVote;
        next();
      });
    } else {
      next();
    }
  });

  /**
   * The method is responsible for handling logic after save a vote
   */
  UsersVoteQuestions.observe('after save', function(ctx, next) {
    logger.debug('After saved UsersVoteQuestions');
    let data = ctx.instance ? ctx.instance : ctx.data;
    let number = data.isPositiveVote ? 1 : -1;
    if (!ctx.isNewInstance) {
      number = number * 2;
    }
    service.handleAfterSave(UsersVoteQuestions.app, data, number, (err) => {
      if (err) next(err);
      else next();
    });
  });
};
