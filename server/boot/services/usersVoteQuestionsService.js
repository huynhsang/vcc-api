'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let questionService = require('./questionService');

let service = {};

/**
 * The method handles logic after save an instance of UsersVoteQuestions
 * @param app: {Object} The application object
 * @param data: {Object} The instance of UsersVoteQuestions
 * @param cb: {Function} The callback function
 */
service.handleAfterSave = function(app, data, cb) {
  logger.debug('Service handle after save usersVoteQuestions', data.id);
  const Question = app.models.Question;
  let number = data.isPositiveVote ? 1 : -1;
  questionService.plusOrMinusPropertyByValue(Question, data.questionId,
    'numberOfVotes', number)
    .then(() => cb())
    .catch(err => cb(err));
};
//
// service.handleToggleVoteByIds = function(app, questionId, userId, cb) {
//   logger.debug(formatter.string(
//     'Service handle toggle user {0} Votes Question {1}', [userId, questionId]));
//   const UsersVoteQuestions = app.models.UsersVoteQuestions;
//   repository.findOne(UsersVoteQuestions, {
//     where: {
//       questionId: questionId,
//       userId: userId,
//     },
//   }, (err, instance) => {
//     if (err) return cb(err);
//     if (!instance) return cb(new Error('Not found!'));
//
//   })
// };

module.exports = service;
