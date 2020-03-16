export default (Question) => {
    Question.disableRemoteMethodByName('create');
    Question.disableRemoteMethodByName('exists');
    Question.disableRemoteMethodByName('count');
    Question.disableRemoteMethodByName('findOne');
    Question.disableRemoteMethodByName('update');
    Question.disableRemoteMethodByName('find');
    Question.disableRemoteMethodByName('findById');
    Question.disableRemoteMethodByName('findOrCreate');
    Question.disableRemoteMethodByName('replaceOrCreate');
    Question.disableRemoteMethodByName('replaceById');
    Question.disableRemoteMethodByName('upsertWithWhere');
    Question.disableRemoteMethodByName('upsert');
    Question.disableRemoteMethodByName('deleteById');
    Question.disableRemoteMethodByName('createChangeStream');
    Question.disableRemoteMethodByName('prototype.updateAttributes');
    Question.disableRemoteMethodByName('prototype.__get__askedBy');

    Question.disableRemoteMethodByName('prototype.__get__category');
    Question.disableRemoteMethodByName('prototype.__findById__category');
    Question.disableRemoteMethodByName('prototype.__create__category');
    Question.disableRemoteMethodByName('prototype.__update__category');
    Question.disableRemoteMethodByName('prototype.__destroy__category');

    Question.disableRemoteMethodByName('prototype.__get__bestAnswer');
    Question.disableRemoteMethodByName('prototype.__findById__bestAnswer');
    Question.disableRemoteMethodByName('prototype.__create__bestAnswer');
    Question.disableRemoteMethodByName('prototype.__update__bestAnswer');
    Question.disableRemoteMethodByName('prototype.__destroy__bestAnswer');

    Question.disableRemoteMethodByName('prototype.__get__remove');
    Question.disableRemoteMethodByName('prototype.__findById__remove');
    Question.disableRemoteMethodByName('prototype.__create__remove');
    Question.disableRemoteMethodByName('prototype.__update__remove');
    Question.disableRemoteMethodByName('prototype.__destroy__remove');

    Question.disableRemoteMethodByName('prototype.__get__tags');
    Question.disableRemoteMethodByName('prototype.__findById__tags');
    Question.disableRemoteMethodByName('prototype.__create__tags');
    Question.disableRemoteMethodByName('prototype.__destroyById__tags'); // DELETE
    Question.disableRemoteMethodByName('prototype.__delete__tags'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__tags');
    Question.disableRemoteMethodByName('prototype.__count__tags');

    Question.disableRemoteMethodByName('prototype.__get__answers');
    Question.disableRemoteMethodByName('prototype.__findById__answers');
    Question.disableRemoteMethodByName('prototype.__create__answers');
    Question.disableRemoteMethodByName('prototype.__destroyById__answers'); // DELETE
    Question.disableRemoteMethodByName('prototype.__delete__answers'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__answers');
    Question.disableRemoteMethodByName('prototype.__count__answers');

    Question.disableRemoteMethodByName('prototype.__get__votes');
    Question.disableRemoteMethodByName('prototype.__findById__votes');
    Question.disableRemoteMethodByName('prototype.__create__votes');
    Question.disableRemoteMethodByName('prototype.__destroyById__votes'); // DELETE
    Question.disableRemoteMethodByName('prototype.__delete__votes'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__votes');
    Question.disableRemoteMethodByName('prototype.__count__votes');

    Question.disableRemoteMethodByName('prototype.__get__reports');
    Question.disableRemoteMethodByName('prototype.__findById__reports');
    Question.disableRemoteMethodByName('prototype.__create__reports');
    Question.disableRemoteMethodByName('prototype.__destroyById__reports'); // DELETE
    Question.disableRemoteMethodByName('prototype.__delete__reports'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__reports');
    Question.disableRemoteMethodByName('prototype.__count__reports');

    Question.disableRemoteMethodByName('prototype.__get__supporters');
    Question.disableRemoteMethodByName('prototype.__findById__supporters');
    Question.disableRemoteMethodByName('prototype.__create__supporters');
    Question.disableRemoteMethodByName('prototype.__destroyById__supporters'); // DELETE
    Question.disableRemoteMethodByName('prototype.__delete__supporters'); // DELETE
    Question.disableRemoteMethodByName('prototype.__updateById__supporters');
    Question.disableRemoteMethodByName('prototype.__count__supporters');
};
