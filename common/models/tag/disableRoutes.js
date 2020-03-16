export default (Tag) => {
    Tag.disableRemoteMethodByName('create');
    Tag.disableRemoteMethodByName('exists');
    Tag.disableRemoteMethodByName('count');
    Tag.disableRemoteMethodByName('findOne');
    Tag.disableRemoteMethodByName('update');
    Tag.disableRemoteMethodByName('find');
    Tag.disableRemoteMethodByName('findById');
    Tag.disableRemoteMethodByName('findOrCreate');
    Tag.disableRemoteMethodByName('replaceOrCreate');
    Tag.disableRemoteMethodByName('replaceById');
    Tag.disableRemoteMethodByName('upsertWithWhere');
    Tag.disableRemoteMethodByName('upsert');
    Tag.disableRemoteMethodByName('deleteById');
    Tag.disableRemoteMethodByName('createChangeStream');
    Tag.disableRemoteMethodByName('prototype.updateAttributes');
    Tag.disableRemoteMethodByName('prototype.replaceAttributes');

    Tag.disableRemoteMethodByName('prototype.__get__categories');
    Tag.disableRemoteMethodByName('prototype.__findById__categories');
    Tag.disableRemoteMethodByName('prototype.__create__categories');
    Tag.disableRemoteMethodByName('prototype.__destroyById__categories'); // DELETE
    Tag.disableRemoteMethodByName('prototype.__delete__categories'); // DELETE
    Tag.disableRemoteMethodByName('prototype.__updateById__categories');
    Tag.disableRemoteMethodByName('prototype.__count__categories');
    Tag.disableRemoteMethodByName('prototype.__link__categories');
    Tag.disableRemoteMethodByName('prototype.__unlink__categories');
    Tag.disableRemoteMethodByName('prototype.__exists__categories');
};
