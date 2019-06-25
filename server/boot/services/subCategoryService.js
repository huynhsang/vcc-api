'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');

let service = {};

/**
 * The method handles logic to increase or reduce property of subCategory by number
 * @param SubCategory: The SubCategory model
 * @param subCategoryId: The subCategory Id
 * @param propertyName: The property name need to update
 * @param number: The number of increment (positive) or reduction (negative)
 * @return {Promise<>} updated value of the property or error
 */
service.plusOrMinusPropertyByValue = function(SubCategory, subCategoryId,
                                              propertyName, number) {
  logger.info(formatter.string('Updating {0} of subCategory with id {1} by 1',
    [propertyName, subCategoryId]));
  return new Promise((resolve, reject) => {
    // Start the transaction
    SubCategory.beginTransaction({
      isolationLevel: SubCategory.Transaction.READ_COMMITTED,
    }, function(err, tx) {
      // Perform operations in a transaction
      repository.findById(SubCategory, subCategoryId, {
        transaction: tx,
      }, (err, subCategory) => {
        if (err || !subCategory) {
          const errorMsg = err ? err : formatter.string(
            'SubCategory not found with id {0}', [subCategoryId]);
          logger.error(errorMsg);
          tx.rollback();
          return reject();
        }

        let inc = subCategory[propertyName] + number;

        subCategory.updateAttribute(propertyName, inc, {
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
            logger.info(formatter.string('Updated subCategory {0} for Id {1}',
              [propertyName, subCategoryId]));
            resolve(updated[propertyName]);
          });
        });
      });
    });
  });
};

module.exports = service;
