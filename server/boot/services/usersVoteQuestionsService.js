'use strict';

let logger = require('../../../utils/logger');
// let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let constant = require('../../../common/constants/appConstant');
let questionService = require('./questionService');
let reputationService = require('./reputationService');

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
    .then((question) => {
      // Update reputation after voting
      const isNewInstance = number % 2 !== 0;
      service.updateReputation(app, data, question, isNewInstance, cb);
    })
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

/**
 * The method responsible for validate data before saving
 * @param UsersVoteQuestions: {Object} The UsersVoteQuestions model
 * @param data: {Object} The data of usersVoteQuestions
 * @param cb: {Function} The callback function
 */
service.validateBeforeSave = function(UsersVoteQuestions, data, cb) {
  logger.debug('Service handle validate data before save');
  const Question = UsersVoteQuestions.app.models.Question;
  questionService.findOneById(Question, data.questionId, (err, question) => {
    if (err) return cb(err);
    if (!question) return cb(new Error('Question not found'));
    if (question.createdBy === data.userId) {
      return cb(new Error('Cannot vote on your question'));
    }
    cb();
  });
};

/**
 * The method will update user reputation after voting
 * @param app: {Object} The application
 * @param usersVoteQuestions: {Object} The usersVoteQuestion instance
 * @param question: {Object} The question instance
 * @param isNewInstance: {Boolean} Is new Instance
 * @param cb {Function} The callback function
 */
service.updateReputation = function(app, usersVoteQuestions, question,
                                    isNewInstance, cb) {
  const Reputation = app.models.Reputation;

  const point = usersVoteQuestions.isPositiveVote ?
    constant.REPUTATION_POINT.UP_VOTE : constant.REPUTATION_POINT.DOWN_VOTE;
  const action = usersVoteQuestions.isPositiveVote ?
    constant.REPUTATION_ACTION.UP_VOTE : constant.REPUTATION_ACTION.DOWN_VOTE;

  // Check if isNewInstance
  if (isNewInstance) {
    reputationService.create(Reputation, action, point, question.createdBy,
      question.id, null, usersVoteQuestions.userId, cb);
  } else {
    reputationService.findOneToUpdate(Reputation, usersVoteQuestions.userId,
      null, usersVoteQuestions.questionId, (err, reputation) => {
        if (err) return cb(err);
        if (!reputation) {
          return reputationService.create(Reputation, action, point,
            question.createdBy, question.id, null, usersVoteQuestions.userId,
            cb);
        }
        reputationService.updateReputationAction(app, reputation, action, point,
          cb);
      });
  }
};

module.exports = service;
