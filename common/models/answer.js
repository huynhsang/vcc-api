'use strict';

let logger = require('./../../utils/logger');
let service = require('./../../server/boot/services/answerService');

module.exports = function(Answer) {
  /**
   *
   * The method is responsible for handling logic before saving Answer
   */
  Answer.observe('before save', function(ctx, next) {
    logger.debug('Before saving Answer');
    let data = ctx.instance ? ctx.instance : ctx.data;

    // Handling logic when Update
    if (!ctx.isNewInstance) {
      // In case, User try to change created || createdBy values
      if (data.created || data.createdBy) {
        let answerId = ctx.instance ? ctx.instance.id :
          ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;

        service.findOneById(Answer, answerId, (err, answer) => {
          if (err) return next(err);
          if (!answer) return next(new Error('Answer not found!'));
          data.created = answer.created;
          data.createdBy = answer.createdBy;
          next();
        });
      } else next();
    } else {
      data.createdBy = ctx.options.accessToken.userId;
      next();
    }
  });

  /**
   * The method will call the service to get answers by question Id
   *
   * @param id {Number} The question Id
   * @param filter {Object} Optional Filter JSON object.
   * @param options: {Object} The options
   * @param cb {Function} Callback function.
   */
  Answer.getAnswersByQuestionId = function(id, filter = {}, options, cb) {
    logger.debug('Starting to get answers by questionId', id);
    const token = options && options.accessToken;
    const userId = token && token.userId;
    service.getAnswersByQuestionId(Answer, id, filter, userId,
      (err, answers) => {
        if (err) return cb(err);
        cb(null, answers);
      });
  };

  /**
   * To Describe API end point to get answers by question Id
   */
  Answer.remoteMethod('getAnswersByQuestionId', {
    accepts: [
      {arg: 'id', type: 'number', required: true, description: 'Question Id'},
      {arg: 'filter', type: 'object', http: {source: 'query'}},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    description: 'Find all Answers By question Id',
    returns: {type: 'array', root: true},
    http: {path: '/find-all-by-question-id', verb: 'get'},
  });

  /**
   * The method observe then run after create method is called
   */
  Answer.afterRemote('customCreate', function(context, answer, next) {
    logger.debug('Update number of Answers after create an answer');
    service.updateNumOfAnswersAfterCreate(Answer.app, answer, (err) => {
      if (err) return next(err);
      next();
    });
  });

  /**
   * Hide the default 'create' remote method
   */
  Answer.disableRemoteMethodByName('create');

  /**
   * Add a custom 'customCreate' remote method
   */
  Answer.remoteMethod('customCreate', {
    description:
      'Create a new instance of the model and persist it into the data source.',
    accessType: 'WRITE',
    accepts: [
      {
        arg: 'data',
        type: 'object',
        model: 'Answer',
        allowArray: true,
        description: 'Model instance data',
        http: {source: 'body'},
      },
      {arg: 'options', type: 'object', http: 'optionsFromRequest'},
    ],
    returns: {arg: 'data', type: 'Answer', root: true},
    http: {verb: 'post', path: '/'},
    isStatic: true,
  });

  /**
   * Implement the customCreate function
   * @param data: {Object} The answer data
   * @param options: {Object} The options
   * @param cb: {Function} Callback function
   */
  Answer.customCreate = function(data, options, cb) {
    Answer.create(data, options, function(err, newObj) {
      if (err) {
        cb(err);
      } else {
        // here we try to load the user value
        newObj.answerBy(function(err, user) {
          if (user) {
            // if we found a user we add it to __data, so it appears in the output (a bit hacky way)
            newObj.__data.answerBy = user;
          }

          cb(err, newObj);
        });
      }
    });
  };
};
