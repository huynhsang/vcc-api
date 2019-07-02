'use strict';

let constant = require('../../../common/constants/appConstant');
let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let userService = require('./userService');

let service = {};

/**
 * The method will create a reputation
 * @param Reputation: {Object} The Reputation model
 * @param action: {String} The action
 * @param point: {Number} The point of reputation
 * @param ownerId: {Number} The owner Id
 * @param questionId: {Number} The question Id
 * @param answerId: {Number} The answer Id
 * @param createdBy: {Number} The user Id who create the reputation
 * @param cb {Function} The callback function
 */
service.create = function(Reputation, action, point, ownerId, questionId,
                          answerId, createdBy, cb) {
  logger.debug(formatter.string(
    'Create new reputation for user {0} on question {1}, answer {2}',
    [ownerId, questionId, answerId]));
  const User = Reputation.app.models.user;
  const reputation = {
    ownerId: ownerId,
    action: action,
    point: point,
    questionId: questionId,
    answerId: answerId,
    createdBy: createdBy,
    updatedBy: createdBy,
  };
  repository.save(Reputation, reputation, (err, reputation) => {
    if (err) return cb(err);
    userService.updateUserPoints(User, reputation, true, cb);
  });
};

/**
 * The method will find one reputation to update Its action
 * @param Reputation: {Object} The Reputation model
 * @param createdBy: {Number} The user Id who create reputation
 * @param answerId: {Number} The answer Id
 * @param questionId: {Number} The question Id
 * @param cb {Function} The callback function
 */
service.findOneToUpdate = function(Reputation, createdBy, answerId, questionId,
                                   cb) {
  logger.debug(formatter.string(
    'Find one reputation with question {0} answer {1} createdBy {2}',
    [questionId, answerId, createdBy]));
  repository.findOne(Reputation, {
    where: {
      questionId: questionId,
      answerId: answerId,
      createdBy: createdBy,
      action: {
        neq: constant.REPUTATION_ACTION.ACCEPT,
      },
    },
    limit: 1,
  }, cb);
};

/**
 * The method will update the action & point of the reputation
 * @param app: {Object} The Application
 * @param reputation: {Object} The instance of reputation
 * @param action: {String} The action name
 * @param point: {Number} The point
 * @param cb: {Function} The callback function
 */
service.updateReputationAction = function(app, reputation, action, point, cb) {
  logger.debug(formatter.string('Update action & point of reputation {0}',
    [reputation.id]));
  const User = app.models.user;
  const update = {
    action: action,
    point: point,
  };
  reputation.updateAttributes(update, (err, reputation) => {
    if (err) return cb(err);
    userService.updateUserPoints(User, reputation, false, cb);
  });
};

/**
 * The method will be called after user approve an answer
 * @param Reputation: {Object} The Reputation model
 * @param answer: {Object} The answer instance
 * @param createBy: {Number} The user who create the reputation
 * @param cb: {Function} The callback function
 */
service.createReputationWithAcceptAction = function(Reputation, answer,
                                                    createBy, cb) {
  logger.debug('Create reputation with accept action');
  service.create(Reputation, constant.REPUTATION_ACTION.ACCEPT,
    constant.REPUTATION_POINT.ACCEPT, answer.createdBy, answer.questionId,
    answer.id, createBy, cb);
};

module.exports = service;
