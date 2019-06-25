'use strict';

let logger = require('../../../utils/logger');
let formatter = require('../../../utils/formatter');
let repository = require('../../common/repositories/persistedModelExtend');

let service = {};

/**
 * The method handles logic to increase or reduce property of category by number
 * @param Category: The Category model
 * @param categoryId: The category Id
 * @param number: The number of increment (positive) or reduction (negative)
 * @return {Promise<>} updated value of the property or error
 */
service.plusOrMinusNumOfQuestionsByValue = function(Category, categoryId,
                                                    number) {
  logger.info(formatter.string('Updating {0} of category with id {1} by 1',
    ['numberOfQuestions', categoryId]));
  return new Promise((resolve, reject) => {
    // Start the transaction
    Category.beginTransaction({
      isolationLevel: Category.Transaction.READ_COMMITTED,
    }, function(err, tx) {
      // Perform operations in a transaction
      repository.findById(Category, categoryId, {
        transaction: tx,
      }, (err, category) => {
        if (err || !category) {
          const errorMsg = err ? err : formatter.string(
            'Category not found with id {0}', [categoryId]);
          logger.error(errorMsg);
          tx.rollback();
          return reject();
        }

        let inc = category['numberOfQuestions'] + number;

        category.updateAttribute('numberOfQuestions', inc, {
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
            logger.info(formatter.string('Updated category {0} for Id {1}',
              ['numberOfQuestions', categoryId]));
            resolve(updated['numberOfQuestions']);
          });
        });
      });
    });
  });
};

module.exports = service;
