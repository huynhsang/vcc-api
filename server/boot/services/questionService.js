'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let categoryService = require('./categoryService');
let subCategoryService = require('./subCategoryService');
let userService = require('./userService');
let reputationService = require('./reputationService');

let service = {};

/**
 * The method handles logic to get questions with pagination
 * @param Question: {Object} The Question model
 * @param filter: {Object} Optional Filter JSON object
 * @param userId: {Number} The user Id
 * @param cb: {Function} The callback function
 */
service.getQuestions = function(Question, filter, userId, cb) {
  logger.debug('Get questions via service');
  if (!filter || !filter.skip) {
    filter = {skip: 0};
  }
  filter.limit = 10;
  filter.include = [{
    relation: 'askedBy',
    scope: {
      fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
        'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level'],
    },
  }, {
    relation: 'category',
    scope: {
      fields: ['slug', 'nameEn', 'nameVi'],
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
  if (!filter.order) filter.order = 'created DESC';
  repository.findAll(Question, filter, cb);
};

/**
 * The method handles logic to get question detail by id
 * @param Question: {Object} The Question model
 * @param id: {number} The question Id
 * @param userId: {Number} The user Id
 * @param cb: {Function} The callback function
 */
service.getQuestionDetailById = function(Question, id, userId, cb) {
  logger.debug('Get question detail by id', id);
  let filter = {};
  filter.include = [{
    relation: 'askedBy',
    scope: {
      fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
        'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level'],
    },
  }, {
    relation: 'category',
    scope: {
      fields: ['slug', 'nameEn', 'nameVi'],
    },
  }, {
    relation: 'answers',
    scope: {
      skip: 0,
      limit: 10,
      order: 'created DESC',
      include: [{
        relation: 'answerBy',
        scope: {
          fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
            'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level'],
        },
      }],
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
    filter.include[2].scope.include.push({
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
    isHidden: false,
    isVerified: true,
    id: id,
  };
  filter.order = 'updated DESC';
  repository.findOne(Question, filter, cb);
};

/**
 * The method handles logic to get a Question by Id
 * @param Question: {Object} The Question model
 * @param id: {Number} The question Id
 * @param cb: {Function} The callback function
 */
service.findOneById = function(Question, id, cb) {
  logger.debug('Find one question by id via service');
  repository.findById(Question, id, {}, cb);
};

/**
 * The method handles logic to get a Question by slug
 * @param Question: {Object} The Question model
 * @param slug: {String} The question slug
 * @param cb: {Function} The callback function
 */
service.findOneBySlug = function(Question, slug, cb) {
  logger.debug('Find one question by slug via service', slug);
  repository.findOne(Question, {
    where: {
      slug: slug,
    },
  }, cb);
};

/**
 * The method handles logic to update number of questions after create
 * @param app: {Object} The application object
 * @param question: {Object} The instance of Question
 * @param cb: {Function} The callback function
 */
service.updateNumOfQuestionsAfterCreate = function(app, question, cb) {
  logger.debug('Update number of questions after create new one', question.id);
  const Category = app.models.Category;
  const SubCategory = app.models.SubCategory;
  const User = app.models.user;

  Promise.all([
    categoryService.plusOrMinusNumOfQuestionsByValue(Category,
      question.categorySlug, 1),
    userService.plusOrMinusPropertyByValue(User, question.createdBy,
      'numberOfQuestions', 1),
  ]).then(() => {
    const tags = JSON.parse(question.tags);
    tags.forEach((tag, index) => {
      subCategoryService.plusOrMinusPropertyByValue(SubCategory, tag.id,
        'numberOfQuestions', 1).then(() => {
          if (index === tags.length - 1) {
            cb(null);
          }
        });
    });
  }).catch(err => {
    cb(err);
  });
};

/**
 * The method handles logic to increase or reduce property of question by number
 * @param Question: The Question model
 * @param questionId: The question Id
 * @param propertyName: The property name need to update
 * @param number: The number of increment (positive) or reduction (negative)
 * @return {Promise<>} updated value of the property or error
 */
service.plusOrMinusPropertyByValue = function(Question, questionId,
                                              propertyName, number) {
  logger.info(formatter.string('Updating {0} of question with id {1} by 1',
    [propertyName, questionId]));
  return new Promise((resolve, reject) => {
    // Start the transaction
    Question.beginTransaction({
      isolationLevel: Question.Transaction.READ_COMMITTED,
    }, function(err, tx) {
      // Perform operations in a transaction
      repository.findById(Question, questionId, {
        transaction: tx,
      }, (err, question) => {
        if (err || !question) {
          const errorMsg = err ? err : formatter.string(
            'Question not found with id {0}', [questionId]);
          logger.error(errorMsg);
          tx.rollback();
          return reject();
        }

        let inc = question[propertyName] + number;

        question.updateAttribute(propertyName, inc, {
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
            logger.info(formatter.string('Updated question {0} for Id {1}',
              [propertyName, questionId]));
            resolve(updated);
          });
        });
      });
    });
  });
};

/**
 * The method handles logic for approving the best answer for question
 * @param app: {Object} The application object
 * @param answerId: {Number} The answer Id
 * @param questionId: {Number} The question Id
 * @param userId: {Number} The user Id
 * @param cb: {Function} The callback function
 */
service.handleApproveAnswer = function(app, answerId, questionId, userId, cb) {
  const Answer = app.models.Answer;
  const Question = app.models.Question;
  repository.findById(Answer, answerId, {}, (err, answer) => {
    if (err) return cb(err);
    if (!answer) return cb(new Error('Answer is not found!'));
    if (answer.questionId !== questionId) {
      return cb(new Error('Answer doesn\'t match with question'));
    }
    if (answer.createdBy === userId) {
      return cb(new Error('Cannot Approve your answer'));
    }

    // Updating the best answer for question
    service.handleUpdateTheBestAnswerProperty(Question, questionId,
      (err) => {
        if (err) {
          logger.error(err);
          return cb(err);
        }
        answer.updateAttribute('isTheBest', true, cb);
      });
  });
};

/**
 * The method processes to sets the 'hasAcceptedAnswer' to true
 * @param Question: {Object} The Question model
 * @param questionId: {Number} The question Id
 * @param cb: {Function} The callback function
 */
service.handleUpdateTheBestAnswerProperty = function(Question, questionId, cb) {
  // Start transaction to update the best answer
  Question.beginTransaction({
    isolationLevel: Question.Transaction.READ_COMMITTED,
  }, function(err, tx) {
    repository.findById(Question, questionId, {
      transaction: tx,
    }, (err, question) => {
      // In case, cannot find question by Id
      if (err) {
        tx.rollback();
        return cb(err);
      }

      // In case, question already has the approved answer
      if (question.hasAcceptedAnswer) {
        return cb(new Error('The best answer already exists'));
      }

      question.updateAttribute('hasAcceptedAnswer', true, {
        transaction: tx,
      }, (err, updated) => {
        if (err) {
          tx.rollback();
          return cb(err);
        }

        // Commit the transaction to make it happen
        tx.commit(function(err) {
          if (err) return cb(err);
          // Counter should have been incremented
          logger.info('Updated the best answer for question id', questionId);
          cb(null, updated);
        });
      });
    });
  });
};

/**
 * The method handles logic after approve answer successfully
 * @param app: {Object} The application
 * @param answer: {Object} The instance of answer
 * @param userId: {Object} The question owner
 * @param cb: {Function} The callback function
 */
service.handleAfterApproveAnswer = function(app, answer, userId, cb) {
  logger.debug('Handle after approve answer', answer.id);
  const Reputation = app.models.Reputation;
  const User = app.models.user;
  reputationService.createReputationWithAcceptAction(Reputation, answer, userId,
    cb);
};

module.exports = service;
