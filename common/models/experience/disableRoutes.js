export default (Experience) => {
    // Experience.disableRemoteMethodByName('create');
    Experience.disableRemoteMethodByName('exists');
    Experience.disableRemoteMethodByName('count');
    Experience.disableRemoteMethodByName('findOne');
    Experience.disableRemoteMethodByName('update');
    // Experience.disableRemoteMethodByName('find');
    Experience.disableRemoteMethodByName('findById');
    // Experience.disableRemoteMethodByName('findOrCreate');
    Experience.disableRemoteMethodByName('replaceOrCreate');
    Experience.disableRemoteMethodByName('replaceById');
    Experience.disableRemoteMethodByName('upsertWithWhere');
    Experience.disableRemoteMethodByName('upsert');
    // Experience.disableRemoteMethodByName('deleteById');
    Experience.disableRemoteMethodByName('createChangeStream');
    Experience.disableRemoteMethodByName('prototype.updateAttributes');
    Experience.disableRemoteMethodByName('prototype.replaceAttributes');
    Experience.disableRemoteMethodByName('prototype.__get__owner');
};
