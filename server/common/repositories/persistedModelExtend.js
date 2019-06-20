'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');

let persistedModelExtend = {};

/**
 * The method is responsible for find an instance by id in Model
 * @param Model: The Model
 * @param id: The instance id
 * @param filter: The filter object
 * @param cb: {func} A callback
 */
persistedModelExtend.findById = function(Model, id, filter = {}, cb) {
  Model.findById(id, filter, (err, model) => {
    if (err) {
      logger.error(formatter.string('Model name {0} FindById {1} error: {2}',
        [Model.name, id, err]));
      return cb(err);
    }
    logger.debug(formatter.string('Model name {0} FindById {1} successfully',
      [Model.name, id]));
    return cb(err, model);
  });
};

/**
 * The method handles find one by any filter then return a callback
 * @param Model: {object} The application model
 * @param filter: {object} The filter
 * @param cb: {func} A callback
 */
persistedModelExtend.findOne = function(Model, filter, cb) {
  Model.findOne(filter, (err, model) => {
    if (err) {
      logger.error(formatter.string('Model name {0} FindOne error: {1}',
        [Model.name, err]));
      return cb(err);
    }
    logger.debug(formatter.string('Model name {0} FindOne successfully',
      [Model.name]));
    return cb(err, model);
  });
};

/**
 * The method handles find with filter then return a callback
 * @param Model: {object} The application model
 * @param filter: {object} The filter
 * @param cb: {func} A callback
 */
persistedModelExtend.findAll = function(Model, filter, cb) {
  Model.find(filter, (err, model) => {
    if (err) {
      logger.error(formatter.string('Model name {0} FindAll error: {1}',
        [Model.name, err]));
      return cb(err);
    }
    logger.debug(formatter.string('Model name {0} FindAll successfully',
      [Model.name]));
    return cb(err, model);
  });
};

/**
 * The method handles save data then return a callback
 * @param Model: {object} The application model
 * @param data: {object} The data of model instance
 * @param cb: {func} A callback
 */
persistedModelExtend.save = function(Model, data, cb) {
  Model.upsert(data, (err, model) => {
    if (err) {
      logger.error(formatter.string('Model name {0} Save error: {1}',
        [Model.name, err]));
      return cb(err);
    }
    logger.debug(formatter.string('Model name {0} Save successfully: {1}',
      [Model.name, model.id]));
    return cb(err, model);
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
