'use strict';
let logger = require('../../utils/logger');
let service = require('../../server/boot/services/usersVoteAnswersService');

module.exports = function(UsersVoteAnswers) {
  /**
   * Handling logic before create new Vote
   */
  UsersVoteAnswers.beforeRemote('create', function(ctx, instance, next) {
    logger.debug('Before create new UsersVoteAnswers');
    ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
      ctx.req.accessToken.userId;
    next();
  });

  /**
   * The method is responsible for handling logic before save a vote
   */
  UsersVoteAnswers.observe('before save', function(ctx, next) {
    logger.debug('Before save UsersVoteAnswers');

    if (!ctx.isNewInstance) {
      let data = ctx.instance ? ctx.instance : ctx.data;
      service.findOneById(UsersVoteAnswers, data.id, (err, instance) => {
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
  UsersVoteAnswers.observe('after save', function(ctx, next) {
    logger.debug('After saved UsersVoteAnswers');

    let data = ctx.instance ? ctx.instance : ctx.data;
    let number = data.isPositiveVote ? 1 : -1;
    if (!ctx.isNewInstance) {
      number = number * 2;
    }
    service.handleAfterSave(UsersVoteAnswers.app, data, number, (err) => {
      if (err) next(err);
      else next();
    });
    // next();
  });
};
