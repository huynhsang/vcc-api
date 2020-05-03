export default (Education) => {
    // Education.disableRemoteMethodByName('create');
    Education.disableRemoteMethodByName('exists');
    Education.disableRemoteMethodByName('count');
    Education.disableRemoteMethodByName('findOne');
    Education.disableRemoteMethodByName('update');
    // Education.disableRemoteMethodByName('find');
    Education.disableRemoteMethodByName('findById');
    Education.disableRemoteMethodByName('findOrCreate');
    // Education.disableRemoteMethodByName('replaceOrCreate');
    Education.disableRemoteMethodByName('replaceById');
    Education.disableRemoteMethodByName('upsertWithWhere');
    Education.disableRemoteMethodByName('upsert');
    // Education.disableRemoteMethodByName('deleteById');
    Education.disableRemoteMethodByName('createChangeStream');
    // Education.disableRemoteMethodByName('prototype.updateAttributes');
    Education.disableRemoteMethodByName('prototype.replaceAttributes');
    Education.disableRemoteMethodByName('prototype.__get__owner');
};
