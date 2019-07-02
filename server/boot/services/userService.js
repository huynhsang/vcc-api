'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let constant = require('../../../common/constants/appConstant');
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

/**
 * The method will update user points
 * @param User: {Object} The user model
 * @param reputation: {Object} The reputation
 * @param isNewInstance: {Boolean} Is new instance
 * @param cb: {Function} The callback function
 */
service.updateUserPoints = function(User, reputation, isNewInstance, cb) {
  let point = reputation.point;
  if (!isNewInstance) {
    point = reputation.point > 0 ? constant.REPUTATION_POINT.POSITIVE_SUM :
      constant.REPUTATION_POINT.NEGATIVE_SUM;
  }
  service.plusOrMinusPropertyByValue(User, reputation.ownerId,
    'points', point)
    .then(() => cb())
    .catch(err => cb(err));
};

module.exports = service;
