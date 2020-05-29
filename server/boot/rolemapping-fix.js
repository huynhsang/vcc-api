module.exports = function (server) {
    const RoleMapping = server.models.RoleMapping;
    // https://github.com/strongloop/loopback/issues/1441
    // Ugly hack for mongo error wainting bug fix for connector
    RoleMapping.defineProperty('principalId', {
        type (id) {
            return require('mongodb').ObjectId('' + id);
        }
    });
};
