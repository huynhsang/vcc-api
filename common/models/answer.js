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
      let answerId = ctx.instance ? ctx.instance.id :
        ctx.currentInstance ? ctx.currentInstance.id : ctx.data.id;
      service.findOneById(Answer, answerId, {}, (err, answer) => {
        if (err) return next(err);
        if (!answer) return next(new Error('Answer not found!'));
        data.created = answer.created;
        data.createdBy = answer.createdBy;
        next();
      });
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
   * @param cb {Function} Callback function.
   */
  Answer.getAnswersByQuestionId = function(id, filter = {}, cb) {
    logger.debug('Starting to get answers by questionId', id);
    service.getAnswersByQuestionId(Answer, id, filter,
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
    ],
    description: 'Find all answers By Question Id',
    returns: {type: 'array', root: true},
    http: {path: '/find-all-by-question-id', verb: 'get'},
  });
};
