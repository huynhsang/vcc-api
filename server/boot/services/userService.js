'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');

let service = {};

/**
 * The method handles logic to increase or reduce property of user by number
 * @param User: The User model
 * @param userId: The user Id
 * @param propertyName: The property name need to update
 * @param number: The number of increment (positive) or reduction (negative)
 * @return {Promise<>} updated value of the property or error
 */
service.plusOrMinusPropertyByValue = function(User, userId,
                                              propertyName, number) {
  logger.info(formatter.string('Updating {0} of user with id {1} by 1',
    [propertyName, userId]));
  return new Promise((resolve, reject) => {
    // Start the transaction
    User.beginTransaction({
      isolationLevel: User.Transaction.READ_COMMITTED,
    }, function(err, tx) {
      // Perform operations in a transaction
      repository.findById(User, userId, {
        transaction: tx,
      }, (err, user) => {
        if (err || !user) {
          const errorMsg = err ? err : formatter.string(
            'User not found with id {0}', [userId]);
          logger.error(errorMsg);
          tx.rollback();
          return reject();
        }

        let inc = user[propertyName] + number;

        user.updateAttribute(propertyName, inc, {
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
            logger.info(formatter.string('Updated user {0} for Id {1}',
              [propertyName, userId]));
            resolve(updated[propertyName]);
          });
        });
      });
    });
  });
};

module.exports = service;
