'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let questionService = require('./questionService');
let userService = require('./userService');

let service = {};

/**
 * The method handles logic to get answers by question Id
 * @param Answer: {object} The Answer model
 * @param questionId: {number} The Question Id
 * @param filter: {object} Optional Filter JSON object
 * @param userId: {number} The user Id
 * @param cb: {func} The callback function
 */
service.getAnswersByQuestionId = function(Answer, questionId, filter, userId,
                                          cb) {
  logger.debug('Get Answers By questionId', questionId);
  if (!filter || !filter.skip) {
    filter = {skip: 0};
  }
  filter.limit = 10;
  filter.include = [{
    relation: 'answerBy',
    scope: {
      fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
        'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level'],
    },
  }];

  if (userId) {
    filter.include.push({
      relation: 'votes',
      scope: {
        fields: ['id', 'questionId', 'userId', 'isPositiveVote', 'reason'],
        where: {
          userId: userId,
        },
        limit: 1,
      },
    });
  }
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

/**
 * The method handles logic to increase or reduce property of answer by number
 * @param Answer: The Answer model
 * @param answerId: The answer Id
 * @param propertyName: The property name need to update
 * @param number: The number of increment (positive) or reduction (negative)
 * @return {Promise<>} updated value of the property or error
 */
service.plusOrMinusPropertyByValue = function(Answer, answerId,
                                              propertyName, number) {
  logger.info(formatter.string('Updating {0} of answer with id {1} by 1',
    [propertyName, answerId]));
  return new Promise((resolve, reject) => {
    // Start the transaction
    Answer.beginTransaction({
      isolationLevel: Answer.Transaction.READ_COMMITTED,
    }, function(err, tx) {
      // Perform operations in a transaction
      repository.findById(Answer, answerId, {
        transaction: tx,
      }, (err, answer) => {
        if (err || !answer) {
          const errorMsg = err ? err : formatter.string(
            'Answer not found with id {0}', [answerId]);
          logger.error(errorMsg);
          tx.rollback();
          return reject();
        }

        let inc = answer[propertyName] + number;

        answer.updateAttribute(propertyName, inc, {
          transaction: tx,
        }, (err, updated) => {
          if (err) {
            logger.error(err);
            tx.rollback();
            return reject(err);
          }

          // Commit the transaction to make it happen
          tx.commit(function(err) {
            if (err) return reject(err);
            // Counter should have been incremented
            logger.info(formatter.string('Updated answer {0} for Id {1}',
              [propertyName, answerId]));
            resolve(updated);
          });
        });
      });
    });
  });
};

module.exports = service;
