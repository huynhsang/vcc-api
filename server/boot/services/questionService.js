'use strict';

let logger = require('../../../utils/logger');
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
        'numberOfAnswers', 'numberOfBestAnswers', 'points'],
    },
  }, {
    relation: 'category',
    scope: {
      fields: ['id', 'nameEn', 'nameVi'],
    },
  }];
  filter.where = {
    isHidden: false,
    isVerified: true,
  };
  filter.order = 'updated DESC';
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
        'numberOfAnswers', 'numberOfBestAnswers', 'points'],
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
            'numberOfAnswers', 'numberOfBestAnswers', 'points'],
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

module.exports = service;
