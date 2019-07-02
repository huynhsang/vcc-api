'use strict';

let logger = require('../../../utils/logger');
// let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let constant = require('../../../common/constants/appConstant');
let answerService = require('./answerService');
let reputationService = require('./reputationService');

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
    .then((answer) => {
      // Update reputation after voting
      const isNewInstance = number % 2 !== 0;
      service.updateReputation(app, data, answer, isNewInstance, cb);
    })
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

/**
 * The method responsible for validate data before saving
 * @param UsersVoteAnswers: {Object} The UsersVoteAnswers model
 * @param data: {Object} The data of usersVoteAnswers
 * @param cb: {Function} The callback function
 */
service.validateBeforeSave = function(UsersVoteAnswers, data, cb) {
  logger.debug('Service handle validate data before save');
  const Answer = UsersVoteAnswers.app.models.Answer;
  answerService.findOneById(Answer, data.answerId, (err, answer) => {
    if (err) return cb(err);
    if (!answer) return cb(new Error('Answer not found'));
    if (answer.createdBy === data.userId) {
      return cb(new Error('Cannot vote on your Answer'));
    }
    cb();
  });
};

/**
 * The method will update user reputation after voting
 * @param app: {Object} The application
 * @param usersVoteAnswers: {Object} The usersVoteQuestion instance
 * @param answer: {Object} The answer instance
 * @param isNewInstance: {Boolean} Is new Instance
 * @param cb {Function} The callback function
 */
service.updateReputation = function(app, usersVoteAnswers, answer,
                                    isNewInstance, cb) {
  const Reputation = app.models.Reputation;

  const point = usersVoteAnswers.isPositiveVote ?
    constant.REPUTATION_POINT.UP_VOTE : constant.REPUTATION_POINT.DOWN_VOTE;
  const action = usersVoteAnswers.isPositiveVote ?
    constant.REPUTATION_ACTION.UP_VOTE : constant.REPUTATION_ACTION.DOWN_VOTE;

  // Check if isNewInstance
  if (isNewInstance) {
    reputationService.create(Reputation, action, point, answer.createdBy,
      answer.questionId, answer.id, usersVoteAnswers.userId, cb);
  } else {
    reputationService.findOneToUpdate(Reputation, usersVoteAnswers.userId,
      usersVoteAnswers.answerId, answer.questionId, (err, reputation) => {
        if (err) return cb(err);
        if (!reputation) {
          return reputationService.create(Reputation, action, point,
            answer.createdBy, answer.questionId, answer.id,
            usersVoteAnswers.userId, cb);
        }
        reputationService.updateReputationAction(app, reputation, action, point,
          cb);
      });
  }
};

module.exports = service;
