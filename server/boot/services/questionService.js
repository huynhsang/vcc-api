'use strict';

let logger = require('../../../utils/logger');
let repository = require('../../common/repositories/persistedModelExtend');
let categoryService = require('./categoryService');
let subCategoryService = require('./subCategoryService');
let userService = require('./userService');

let service = {};

/**
 * The method handles logic to get questions with pagination
 * @param Question: {object} The Question model
 * @param filter: {object} Optional Filter JSON object.
 * @param cb: {func} The callback function
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
  repository.findAll(Question, filter, cb);
};

/**
 * The method handles logic to get a Question by Id
 * @param Question: {object} The Question model
 * @param id: {number} The question Id
 * @param cb: {func} The callback function
 */
service.findOneById = function(Question, id, cb) {
  logger.debug('Find one question by id via service');
  repository.findById(Question, id, {}, cb);
};

/**
 * The method handles logic to update number of questions after create
 * @param app: {object} The application object
 * @param question: {object} The instance of Question
 * @param cb: {func} The callback function
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
