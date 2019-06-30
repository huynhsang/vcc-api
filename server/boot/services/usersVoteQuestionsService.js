'use strict';

let logger = require('../../../utils/logger');
// let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let questionService = require('./questionService');

let service = {};

/**
 * The method handles logic after save an instance of UsersVoteQuestions
 * @param app: {Object} The application object
 * @param data: {Object} The instance of UsersVoteQuestions
 * @param number: {Number} The number will be increase/reduce
 * @param cb: {Function} The callback function
 */
service.handleAfterSave = function(app, data, number, cb) {
  logger.debug('Service handle after save usersVoteQuestions', data.id);
  const Question = app.models.Question;
  questionService.plusOrMinusPropertyByValue(Question, data.questionId,
    'numberOfVotes', number)
    .then(() => cb())
    .catch(err => cb(err));
};

/**
 * The method handles logic to get a UsersVoteQuestions by Id
 * @param UsersVoteQuestions: {Object} The UsersVoteQuestions model
 * @param id: {Number} The usersVoteQuestions Id
 * @param cb: {Function} The callback function
 */
service.findOneById = function(UsersVoteQuestions, id, cb) {
  logger.debug('Service handle findOne UsersVoteQuestions by id', id);
  repository.findById(UsersVoteQuestions, id, {}, cb);
};

module.exports = service;
