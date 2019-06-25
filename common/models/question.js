'use strict';
let logger = require('./../../utils/logger');
let service = require('./../../server/boot/services/questionService');

module.exports = function(Question) {
  /**
   *
   * The method is responsible for handling logic before saving Question
   */
  Question.observe('before save', function(ctx, next) {
    logger.debug('Before saving Question');
    let data = ctx.instance ? ctx.instance : ctx.data;

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      let questionId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      service.findOneById(Question, questionId, (err, question) => {
        if (err) {
          return next(err);
        }
        if (!question) return next(new Error('Question is not found!'));
        data.created = question.created;
        data.createdBy = question.createdBy;
        next();
      });
    } else {
      data.createdBy = ctx.options.accessToken.userId;
      next();
    }
  });

  /**
   * Send verification email after registration
   */
  Question.afterRemote('create', function(context, question, next) {
    service.updateNumOfQuestionsAfterCreate(Question.app, question, (err) => {
      if (err) return next(err);
      next();
    });
  });

  /**
   * The method will call the runner to start crawl articles
   *
   * @param filter {Object} Optional Filter JSON object.
   * @param cb {Function} Callback function.
   */
  Question.getQuestions = function(filter = {}, cb) {
    logger.debug('Starting to get questions...');
    service.getQuestions(Question, filter, (err, questions) => {
      if (err) return cb(err);
      cb(null, questions);
    });
  };

  /**
   * To Describe API end point to get questions
   */
  Question.remoteMethod('getQuestions', {
    accepts: [
      {arg: 'filter', type: 'object', http: {source: 'query'}},
    ],
    description: 'Find all questions',
    returns: {type: 'array', root: true},
    http: {path: '/find-all', verb: 'get'},
  });
};
