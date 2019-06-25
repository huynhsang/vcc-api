'use strict';

let logger = require('../../../utils/logger');
let repository = require('../../common/repositories/persistedModelExtend');

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

module.exports = service;
