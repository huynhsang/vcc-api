'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');
let categoryService = require('./categoryService');
let subCategoryService = require('./subCategoryService');
let userService = require('./userService');

let service = {};

/**
 * The method handles logic to get questions with pagination
 * @param Question: {Object} The Question model
 * @param filter: {Object} Optional Filter JSON object.
 * @param cb: {Function} The callback function
 */
service.getQuestions = function(Question, filter, cb) {
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
      fields: ['id', 'nameEn', 'nameVi'],
    },
  }];
  if (!filter.order) filter.order = 'updated DESC';
  repository.findAll(Question, filter, cb);
};

/**
 * The method handles logic to get question detail by id
 * @param Question: {Object} The Question model
 * @param id: {number} The question Id
 * @param cb: {Function} The callback function
 */
service.getQuestionDetailById = function(Question, id, cb) {
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
      fields: ['id', 'nameEn', 'nameVi'],
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
      question.categoryId, 1),
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
            resolve(updated[propertyName]);
          });
        });
      });
    });
  });
};

module.exports = service;
