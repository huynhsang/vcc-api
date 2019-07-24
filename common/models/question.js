'use strict';
let logger = require('./../../utils/logger');
let formatter = require('./../../utils/formatter');
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
      // In case, User try to change created || createdBy values
      if (data.createdBy || data.created) {
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
      } else next();
    } else {
      data.createdBy = ctx.options.accessToken.userId;
      next();
    }
  });

  /**
   * The method observe then run after create method is called
   */
  Question.afterRemote('create', function(context, question, next) {
    service.updateNumOfQuestionsAfterCreate(Question.app, question, (err) => {
      if (err) return next(err);
      next();
    });
  });

  /**
   * The method will call the service to get questions
   *
   * @param filter {Object} Optional Filter JSON object.
   * @param options: {Object} The options
   * @param cb {Function} Callback function.
   */
  Question.getQuestions = function(filter, options, cb) {
    logger.debug('Starting to get questions...');
    const token = options && options.accessToken;
    const userId = token && token.userId;
    service.getQuestions(Question, filter, userId, (err, questions) => {
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
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    description: 'Find all questions',
    returns: {type: 'array', root: true},
    http: {path: '/find-all', verb: 'get'},
  });

  /**
   * The method will call the service to get question detail
   *
   * @param slug {String} The question slug
   * @param options: {Object} The options
   * @param cb {Function} Callback function.
   */
  Question.getQuestionDetailBySlug = function(slug, options, cb) {
    logger.debug('Starting to get question detail by slug', slug);
    const token = options && options.accessToken;
    const userId = token && token.userId;
    service.getQuestionDetailBySlug(Question, slug, userId, (err, question) => {
      if (err) return cb(err);
      cb(null, question);
    });
  };

  /**
   * To Describe API end point to get questions
   */
  Question.remoteMethod('getQuestionDetailBySlug', {
    accepts: [
      {arg: 'slug', type: 'string', required: true},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    description: 'Get question detail by Id',
    returns: {type: 'object', root: true},
    http: {path: '/get-detail', verb: 'get'},
  });

  /**
   * The method call service to handle approve answer
   * @param data: {Object} The data uses for approving function
   * @param options: {Object} The options
   * @param cb: {Function} The callback function
   */
  Question.approveAnswer = function(data, options, cb) {
    logger.debug(formatter.string('Approve Answer {0} for question {1}',
      [data.answerId, data.id]));
    const userId = options.accessToken.userId;
    if (!data.answerId) cb(new Error('answerId is required'));
    service.handleApproveAnswer(Question.app, data.answerId, data.id,
      userId, cb);
  };

  /**
   * To Describe API end point to approve answer
   */
  Question.remoteMethod('approveAnswer', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'},
        default: {
          id: 0,
          answerId: 0,
        }},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    description: 'Approve answer for question',
    accessType: 'EXECUTE',
    returns: {type: 'Answer', root: true},
    http: {path: '/approve-answer', verb: 'post'},
  });

  Question.afterRemote('approveAnswer', function(context, answer, next) {
    const userId = context.options.accessToken.userId;
    service.handleAfterApproveAnswer(Question.app, answer, userId, (err) => {
      if (err) return next(err);
      next();
    });
  });
};
