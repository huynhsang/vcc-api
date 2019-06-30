'use strict';

let logger = require('../../../utils/logger');
// let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let answerService = require('./answerService');

let service = {};

/**
 * The method handles logic after save an instance of UsersVoteAnswers
 * @param app: {Object} The application object
 * @param data: {Object} The instance of UsersVoteAnswers
 * @param number: {Number} The number will be increase/reduce
 * @param cb: {Function} The callback function
 */
service.handleAfterSave = function(app, data, number, cb) {
  logger.debug('Service handle after save usersVoteAnswers', data.id);
  const Answer = app.models.Answer;
  answerService.plusOrMinusPropertyByValue(Answer, data.answerId,
    'numberOfVotes', number)
    .then(() => cb())
    .catch(err => cb(err));
};

/**
 * The method handles logic to get a UsersVoteAnswers by Id
 * @param UsersVoteAnswers: {Object} The UsersVoteAnswers model
 * @param id: {Number} The usersVoteAnswers Id
 * @param cb: {Function} The callback function
 */
service.findOneById = function(UsersVoteAnswers, id, cb) {
  logger.debug('Service handle findOne UsersVoteAnswers by id', id);
  repository.findById(UsersVoteAnswers, id, {}, cb);
};

module.exports = service;
