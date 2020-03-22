export default (User) => {
    User.disableRemoteMethodByName('create');
    User.disableRemoteMethodByName('exists');
    User.disableRemoteMethodByName('count');
    User.disableRemoteMethodByName('findOne');
    User.disableRemoteMethodByName('update');
    // User.disableRemoteMethodByName('find');
    User.disableRemoteMethodByName('findById');
    User.disableRemoteMethodByName('findOrCreate');
    User.disableRemoteMethodByName('replaceOrCreate');
    User.disableRemoteMethodByName('replaceById');
    User.disableRemoteMethodByName('upsertWithWhere');
    User.disableRemoteMethodByName('upsert');
    User.disableRemoteMethodByName('deleteById');
    User.disableRemoteMethodByName('createChangeStream');
    // User.disableRemoteMethodByName('prototype.updateAttributes');
    User.disableRemoteMethodByName('prototype.replaceAttributes');

    User.disableRemoteMethodByName('prototype.verify');

    // AccessTokens
    User.disableRemoteMethodByName('prototype.__get__accessTokens');
    User.disableRemoteMethodByName('prototype.__findById__accessTokens');
    User.disableRemoteMethodByName('prototype.__create__accessTokens');
    User.disableRemoteMethodByName('prototype.__destroyById__accessTokens'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__accessTokens'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__accessTokens');
    User.disableRemoteMethodByName('prototype.__count__accessTokens');

    // avatar
    User.disableRemoteMethodByName('prototype.__get__avatar');
    User.disableRemoteMethodByName('prototype.__findById__avatar');
    User.disableRemoteMethodByName('prototype.__create__avatar');
    User.disableRemoteMethodByName('prototype.__destroy__avatar'); // DELETE
    User.disableRemoteMethodByName('prototype.__update__avatar');
    User.disableRemoteMethodByName('prototype.__count__avatar');

    // Questions
    User.disableRemoteMethodByName('prototype.__get__questions');
    User.disableRemoteMethodByName('prototype.__findById__questions');
    User.disableRemoteMethodByName('prototype.__create__questions');
    User.disableRemoteMethodByName('prototype.__destroyById__questions'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__questions'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__questions');
    User.disableRemoteMethodByName('prototype.__count__questions');

    // Answers
    User.disableRemoteMethodByName('prototype.__get__answers');
    User.disableRemoteMethodByName('prototype.__findById__answers');
    User.disableRemoteMethodByName('prototype.__create__answers');
    User.disableRemoteMethodByName('prototype.__destroyById__answers'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__answers'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__answers');
    User.disableRemoteMethodByName('prototype.__count__answers');

    // Educations
    User.disableRemoteMethodByName('prototype.__get__educations');
    User.disableRemoteMethodByName('prototype.__findById__educations');
    User.disableRemoteMethodByName('prototype.__create__educations');
    User.disableRemoteMethodByName('prototype.__destroyById__educations'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__educations'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__educations');
    User.disableRemoteMethodByName('prototype.__count__educations');

    // Experiences
    User.disableRemoteMethodByName('prototype.__get__experiences');
    User.disableRemoteMethodByName('prototype.__findById__experiences');
    User.disableRemoteMethodByName('prototype.__create__experiences');
    User.disableRemoteMethodByName('prototype.__destroyById__experiences'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__experiences'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__experiences');
    User.disableRemoteMethodByName('prototype.__count__experiences');

    // Notifications
    User.disableRemoteMethodByName('prototype.__get__notifications');
    User.disableRemoteMethodByName('prototype.__findById__notifications');
    User.disableRemoteMethodByName('prototype.__create__notifications');
    User.disableRemoteMethodByName('prototype.__destroyById__notifications'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__notifications'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__notifications');
    User.disableRemoteMethodByName('prototype.__count__notifications');

    // Votes
    User.disableRemoteMethodByName('prototype.__get__votes');
    User.disableRemoteMethodByName('prototype.__findById__votes');
    User.disableRemoteMethodByName('prototype.__create__votes');
    User.disableRemoteMethodByName('prototype.__destroyById__votes'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__votes'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__votes');
    User.disableRemoteMethodByName('prototype.__count__votes');

    // Roles
    User.disableRemoteMethodByName('prototype.__get__roles');
    User.disableRemoteMethodByName('prototype.__findById__roles');
    User.disableRemoteMethodByName('prototype.__create__roles');
    User.disableRemoteMethodByName('prototype.__destroyById__roles'); // DELETE
    User.disableRemoteMethodByName('prototype.__delete__roles'); // DELETE
    User.disableRemoteMethodByName('prototype.__updateById__roles');
    User.disableRemoteMethodByName('prototype.__count__roles');
    User.disableRemoteMethodByName('prototype.__link__roles');
    User.disableRemoteMethodByName('prototype.__unlink__roles');
    User.disableRemoteMethodByName('prototype.__exists__roles');

    // Badge
    User.disableRemoteMethodByName('prototype.__get__badge');
    User.disableRemoteMethodByName('prototype.__findById__badge');
    User.disableRemoteMethodByName('prototype.__create__badge');
    User.disableRemoteMethodByName('prototype.__destroy__badge');
    User.disableRemoteMethodByName('prototype.__update__badge');

    // Wallet
    User.disableRemoteMethodByName('prototype.__get__wallet');
    User.disableRemoteMethodByName('prototype.__findById__wallet');
    User.disableRemoteMethodByName('prototype.__create__wallet');
    User.disableRemoteMethodByName('prototype.__destroy__wallet');
    User.disableRemoteMethodByName('prototype.__update__wallet');
};
