export default (Category) => {
    // Category.disableRemoteMethodByName('create');
    Category.disableRemoteMethodByName('exists');
    Category.disableRemoteMethodByName('count');
    Category.disableRemoteMethodByName('findOne');
    Category.disableRemoteMethodByName('update');
    // Category.disableRemoteMethodByName('find');
    Category.disableRemoteMethodByName('findById');
    // Category.disableRemoteMethodByName('findOrCreate');
    Category.disableRemoteMethodByName('replaceOrCreate');
    Category.disableRemoteMethodByName('replaceById');
    Category.disableRemoteMethodByName('upsertWithWhere');
    Category.disableRemoteMethodByName('upsert');
    // Category.disableRemoteMethodByName('deleteById');
    Category.disableRemoteMethodByName('createChangeStream');
    Category.disableRemoteMethodByName('prototype.updateAttributes');
    Category.disableRemoteMethodByName('prototype.replaceAttributes');

    Category.disableRemoteMethodByName('prototype.__get__tags');
    Category.disableRemoteMethodByName('prototype.__findById__tags');
    Category.disableRemoteMethodByName('prototype.__create__tags');
    Category.disableRemoteMethodByName('prototype.__destroyById__tags'); // DELETE
    Category.disableRemoteMethodByName('prototype.__delete__tags'); // DELETE
    Category.disableRemoteMethodByName('prototype.__updateById__tags');
    Category.disableRemoteMethodByName('prototype.__count__tags');
    Category.disableRemoteMethodByName('prototype.__link__tags');
    Category.disableRemoteMethodByName('prototype.__unlink__tags');
    Category.disableRemoteMethodByName('prototype.__exists__tags');
};
