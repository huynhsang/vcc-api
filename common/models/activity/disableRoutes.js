export default (Activity) => {
    Activity.disableRemoteMethodByName('create');
    Activity.disableRemoteMethodByName('exists');
    Activity.disableRemoteMethodByName('count');
    Activity.disableRemoteMethodByName('findOne');
    Activity.disableRemoteMethodByName('update');
    Activity.disableRemoteMethodByName('find');
    Activity.disableRemoteMethodByName('findById');
    Activity.disableRemoteMethodByName('findOrCreate');
    Activity.disableRemoteMethodByName('replaceOrCreate');
    Activity.disableRemoteMethodByName('replaceById');
    Activity.disableRemoteMethodByName('upsertWithWhere');
    Activity.disableRemoteMethodByName('upsert');
    Activity.disableRemoteMethodByName('deleteById');
    Activity.disableRemoteMethodByName('createChangeStream');
    Activity.disableRemoteMethodByName('prototype.updateAttributes');
    Activity.disableRemoteMethodByName('prototype.replaceAttributes');
    Activity.disableRemoteMethodByName('prototype.__get__owner');
    Activity.disableRemoteMethodByName('prototype.__get__receiver');
    Activity.disableRemoteMethodByName('prototype.__get__activityModel');
};
