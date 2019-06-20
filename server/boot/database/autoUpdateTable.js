'use strict';

let logger = require('./../../../utils/logger');
const TABLE_LIST = [
  'Role',
  'RoleMapping',
  'user',
  'AccessToken',
  'Category',
  'SubCategory',
  'Tag',
  'Education',
  'Experience',
  'Point',
  'Question',
  'Answer',
  'Notification',
  'TopupCard',
  'Wallet',
  'BuyAnswer',
  'Transaction',
];
let migration = {};

migration.autoUpdateTables = function(app) {
  let mysqlDs = app.dataSources.vccDS;

  let updateTable = function(tableName) {
    return new Promise(resolve => {
      mysqlDs.autoupdate(tableName, function(err) {
        if (err) throw err;
        logger.info('Updated table ', tableName);
        resolve();
      });
    });
  };

  return new Promise(async (resolve) => {
    if (mysqlDs.connected) {
      for (let item of TABLE_LIST) {
        await updateTable(item);
      }
      resolve();
    } else {
      mysqlDs.once('connected', async function() {
        for (let item of TABLE_LIST) {
          await updateTable(item);
        }
        resolve();
      });
    }
  });
};

module.exports = migration;
