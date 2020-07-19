export default (News) => {
    // News.disableRemoteMethodByName('create');
    News.disableRemoteMethodByName('exists');
    News.disableRemoteMethodByName('count');
    News.disableRemoteMethodByName('findOne');
    News.disableRemoteMethodByName('update');
    // News.disableRemoteMethodByName('find');
    // News.disableRemoteMethodByName('findById');
    // News.disableRemoteMethodByName('findOrCreate');
    // News.disableRemoteMethodByName('replaceOrCreate');
    News.disableRemoteMethodByName('replaceById');
    News.disableRemoteMethodByName('upsertWithWhere');
    News.disableRemoteMethodByName('upsert');
    News.disableRemoteMethodByName('deleteById');
    News.disableRemoteMethodByName('createChangeStream');
    // News.disableRemoteMethodByName('prototype.updateAttributes');
    News.disableRemoteMethodByName('prototype.__get__user');
};
