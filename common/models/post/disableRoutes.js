export default (Post) => {
    Post.disableRemoteMethodByName('create');
    Post.disableRemoteMethodByName('exists');
    Post.disableRemoteMethodByName('count');
    // Post.disableRemoteMethodByName('findOne');
    Post.disableRemoteMethodByName('update');
    // Post.disableRemoteMethodByName('find');
    // Post.disableRemoteMethodByName('findById');
    Post.disableRemoteMethodByName('findOrCreate');
    Post.disableRemoteMethodByName('replaceOrCreate');
    Post.disableRemoteMethodByName('replaceById');
    Post.disableRemoteMethodByName('upsertWithWhere');
    Post.disableRemoteMethodByName('upsert');
    // Post.disableRemoteMethodByName('deleteById');
    Post.disableRemoteMethodByName('createChangeStream');
    // Post.disableRemoteMethodByName('prototype.updateAttributes');
    Post.disableRemoteMethodByName('prototype.__get__author');

    Post.disableRemoteMethodByName('prototype.__get__tags');
    Post.disableRemoteMethodByName('prototype.__findById__tags');
    Post.disableRemoteMethodByName('prototype.__create__tags');
    Post.disableRemoteMethodByName('prototype.__destroyById__tags'); // DELETE
    Post.disableRemoteMethodByName('prototype.__delete__tags'); // DELETE
    Post.disableRemoteMethodByName('prototype.__updateById__tags');
    Post.disableRemoteMethodByName('prototype.__count__tags');

    Post.disableRemoteMethodByName('prototype.__get__images');
    Post.disableRemoteMethodByName('prototype.__findById__images');
    Post.disableRemoteMethodByName('prototype.__create__images');
    Post.disableRemoteMethodByName('prototype.__destroyById__images'); // DELETE
    Post.disableRemoteMethodByName('prototype.__delete__images'); // DELETE
    Post.disableRemoteMethodByName('prototype.__updateById__images');
    Post.disableRemoteMethodByName('prototype.__count__images');

    Post.disableRemoteMethodByName('prototype.__get__characters');
    Post.disableRemoteMethodByName('prototype.__findById__characters');
    Post.disableRemoteMethodByName('prototype.__create__characters');
    Post.disableRemoteMethodByName('prototype.__destroyById__characters'); // DELETE
    Post.disableRemoteMethodByName('prototype.__delete__characters'); // DELETE
    Post.disableRemoteMethodByName('prototype.__updateById__characters');
    Post.disableRemoteMethodByName('prototype.__count__characters');
};
