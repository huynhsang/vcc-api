'use strict';

let logger = require('../../../utils/logger');
let repository = require('../../common/repositories/persistedModelExtend');
let questionService = require('./questionService');
let userService = require('./userService');

let service = {};

/**
 * The method handles logic to get answers by question Id
 * @param Answer: {object} The Answer model
 * @param questionId: {number} The Question Id
 * @param filter: {object} Optional Filter JSON object.
 * @param cb: {func} The callback function
 */
service.getAnswersByQuestionId = function(Answer, questionId, filter, cb) {
  logger.debug('Get Answers By questionId', questionId);
  if (!filter || !filter.skip) {
    filter = {skip: 0};
  }
  filter.limit = 10;
  filter.include = [{
    relation: 'answerBy',
    scope: {
      fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
        'numberOfAnswers', 'numberOfBestAnswers', 'points'],
    },
  }];
  filter.where = {
    questionId: questionId,
  };
  filter.order = 'created DESC';
  repository.findAll(Answer, filter, cb);
};

/**
 * The method handles logic to get a Answer by Id
 * @param Answer: {Object} The Answer model
 * @param id: {Number} The answer Id
 * @param cb: {Function} The callback function
 */
service.findOneById = function(Answer, id, cb) {
  logger.debug('Find one answer by id via service');
  repository.findById(Answer, id, {}, cb);
};

module.exports = service;
