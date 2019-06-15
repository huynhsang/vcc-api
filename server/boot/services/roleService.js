'use strict';

let log = require('../../../utils/logger');
let constant = require('../../../common/constants/appConstant');

let roleService = {};

/**
 * Init Roles (admin and user)
 * @param app: application context
 */
roleService.initRoles = async function(app) {
  let Role = app.models.Role;
  let ROLE_NAME = [constant.ROLE.ADMIN, constant.ROLE.USER];

  return new Promise(async function(resolve, reject) {
    for (const name of ROLE_NAME) {
      // Lookup the existed role
      await Role.findOne({
        where: {
          name: name,
        },
      }, (err, role) => {
        // The datasource produced an error!
        if (err) reject(err);

        // Q: Is the role existed?
        if (!role) {
          // A: No, It's not. Then create a new one
          Role.create({
            name: name,
          }, function(err, role) {
            if (err) reject(err);

            if (role) {
              log.info('Successfully, Create a new role name ', name);
            }
          });
        }
      });
    }
    resolve(true);
  });
};

/**
 * Mapping new user to role
 * @param app: application context
 * @param user: a new user
 */
roleService.mappingRoleToUser = function(app, user) {
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;
  let roleName = constant.ROLE.USER;

  if (user.realm.includes(constant.ROLE.ADMIN)) {
    roleName = constant.ROLE.ADMIN;
  }

  return new Promise(function(resolve, reject) {
    Role.findOne({
      where: {
        name: roleName,
      },
    }, (err, role) => {
      if (err) reject(err);

      if (role) {
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id,
        }, function(err, principal) {
          if (err) reject(err);

          log.info('Created principal:', principal);
          resolve(true);
        });
      } else {
        log.error('Role Not Found!', roleName);
        resolve(false);
      }
    });
  });
};

/**
 * Init default account for admin
 * @param app: application context
 */
roleService.initDefaultAdmin = function(app) {
  let User = app.models.User;
  User.findOne({
    where: {
      email: constant.adminEmail,
      realm: constant.realm.admin,
    },
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      log.info('Starting to create default account for admin');
      User.create({
        avatar: 'avatar_path',
        createdBy: 'System',
        createdDate: new Date(),
        dateOfBirth: new Date(),
        email: constant.adminEmail,
        firstName: 'sang',
        lastName: 'huynh',
        isEnable: 1,
        lastModifiedBy: 'System',
        lastModifiedDate: new Date(),
        nationality: 'VietNam',
        realm: constant.realm.admin,
        emailVerified: true,
        password: 'vcc2019',
      }, function(err, user) {
        if (err) throw err;

        if (user) {
          log.info('Created default account for admin:', user);
          roleService.mappingRoleToUser(app, user);
        }
      });
    }
  });
};
module.exports = roleService;
