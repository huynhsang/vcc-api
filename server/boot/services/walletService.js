'use strict';

let logger = require('../../../utils/logger');
let repository = require('../../common/repositories/persistedModelExtend');

let service = {};

/**
 * The method handles logic to create new wallet for given user id
 * @param app: {object} The application object
 * @param userId: the owner id
 * @param cb: The callback function
 */
service.createWallet = function(app, userId, cb) {
  logger.info('Create new wallet for user ID', userId);
  const Wallet = app.models.Wallet;
  const newWallet = {
    amount: 0,
    ownerId: userId,
    createdBy: userId,
    updatedBy: userId,
  };
  repository.save(Wallet, newWallet, cb);
};

module.exports = service;
