'use strict';

let logger = require('./../../../utils/logger');
let migration = require('../database/autoUpdateTable');
let roleService = require('./../services/roleService');

module.exports = function(app) {
  migration.autoUpdateTables(app).then(() => {
    // Init Roles
    logger.info('Executing init roles');
    roleService.initRoles(app).then(() => {
      logger.info('Executing create default accounts');
      roleService.initDefaultAdmin(app);
    });
  }).catch(err => {});
};
