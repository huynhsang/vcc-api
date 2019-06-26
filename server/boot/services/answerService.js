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
    relation: 'createdBy',
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

/**
 * The method handles logic to update number of answers after create
 * @param app: {Object} The application object
 * @param answer: {Object} The instance of Question
 * @param cb: {Function} The callback function
 */
service.updateNumOfAnswersAfterCreate = function(app, answer, cb) {
  logger.debug('Update number of answers after create new one', answer.id);
  const Question = app.models.Question;
  const User = app.models.user;

  Promise.all([
    questionService.plusOrMinusPropertyByValue(Question, answer.questionId,
      'numberOfAnswers', 1),
    userService.plusOrMinusPropertyByValue(User, answer.createdBy,
      'numberOfAnswers', 1),
  ]).then(() => cb())
    .catch(err => cb(err));
};

module.exports = service;
