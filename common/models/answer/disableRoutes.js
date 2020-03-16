export default (Answer) => {
    Answer.disableRemoteMethodByName('create');
    Answer.disableRemoteMethodByName('exists');
    Answer.disableRemoteMethodByName('count');
    Answer.disableRemoteMethodByName('findOne');
    Answer.disableRemoteMethodByName('update');
    Answer.disableRemoteMethodByName('find');
    Answer.disableRemoteMethodByName('findById');
    Answer.disableRemoteMethodByName('findOrCreate');
    Answer.disableRemoteMethodByName('replaceOrCreate');
    Answer.disableRemoteMethodByName('replaceById');
    Answer.disableRemoteMethodByName('upsertWithWhere');
    Answer.disableRemoteMethodByName('upsert');
    Answer.disableRemoteMethodByName('deleteById');
    Answer.disableRemoteMethodByName('createChangeStream');
    Answer.disableRemoteMethodByName('prototype.updateAttributes');
    Answer.disableRemoteMethodByName('prototype.replaceAttributes');
    Answer.disableRemoteMethodByName('prototype.__get__answerBy');
    Answer.disableRemoteMethodByName('prototype.__get__question');

    Answer.disableRemoteMethodByName('prototype.__get__reports');
    Answer.disableRemoteMethodByName('prototype.__findById__reports');
    Answer.disableRemoteMethodByName('prototype.__create__reports');
    Answer.disableRemoteMethodByName('prototype.__destroyById__reports'); // DELETE
    Answer.disableRemoteMethodByName('prototype.__delete__reports'); // DELETE
    Answer.disableRemoteMethodByName('prototype.__updateById__reports');
    Answer.disableRemoteMethodByName('prototype.__count__reports');

    Answer.disableRemoteMethodByName('prototype.__get__votes');
    Answer.disableRemoteMethodByName('prototype.__findById__votes');
    Answer.disableRemoteMethodByName('prototype.__create__votes');
    Answer.disableRemoteMethodByName('prototype.__destroyById__votes'); // DELETE
    Answer.disableRemoteMethodByName('prototype.__delete__votes'); // DELETE
    Answer.disableRemoteMethodByName('prototype.__updateById__votes');
    Answer.disableRemoteMethodByName('prototype.__count__votes');
};
