'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');

let persistedModelExtend = {};

/**
 * The method is responsible for find an instance by id in Model
 * @param Model: The Model
 * @param id: The instance id
 * @param filter: The filter object
 * @return {Promise<Object>} a model instance
 */
persistedModelExtend.findById = function(Model, id, filter = {}) {
  return new Promise(function(resolve, reject) {
    Model.findById(id, filter, (err, model) => {
      if (err) {
        logger.error(formatter.string('Model name {0} FindById {1} error: {2}',
          [Model.name, id, err]));
        return reject(err);
      }
      logger.debug(formatter.string('Model name {0} FindById {1} successfully',
        [Model.name, id]));
      return resolve(model);
    });
  });
};

persistedModelExtend.findOne = function(Model, filter) {
  return new Promise(function(resolve, reject) {
    Model.findOne(filter, (err, model) => {
      if (err) {
        logger.error(formatter.string('Model name {0} FindOne error: {1}',
          [Model.name, err]));
        return reject(err);
      }
      logger.debug(formatter.string('Model name {0} FindOne successfully',
        [Model.name]));
      return resolve(model);
    });
  });
};

persistedModelExtend.findAll = function(Model, filter) {
  return new Promise(function(resolve, reject) {
    Model.find(filter, (err, model) => {
      if (err) {
        logger.error(formatter.string('Model name {0} FindAll error: {1}',
          [Model.name, err]));
        return reject(err);
      }
      logger.debug(formatter.string('Model name {0} FindAll successfully',
        [Model.name]));
      return resolve(model);
    });
  });
};

persistedModelExtend.save = function(Model, data) {
  return new Promise(function(resolve, reject) {
    Model.upsert(data, (err, model) => {
      if (err) {
        logger.error(formatter.string('Model name {0} Save error: {1}',
          [Model.name, err]));
        return reject(err);
      }
      logger.debug(formatter.string('Model name {0} Save successfully: {1}',
        [Model.name, model.id]));
      return resolve(model);
    });
  });
};

persistedModelExtend.count = function(Model, filter) {
  return new Promise(function(resolve, reject) {
    Model.count(filter, (err, value) => {
      if (err) {
        logger.error(formatter.string('Model name {0} Count error: {1}',
          [Model.name, err]));
        return reject(err);
      }
      logger.debug('Count successfully', value);
      logger.debug(formatter.string('Model name {0} Count successfully: {1}',
        [Model.name, value]));
      return resolve(value);
    });
  });
};

module.exports = persistedModelExtend;
