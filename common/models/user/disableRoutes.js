export default (User) => {
    User.disableRemoteMethodByName('updateAttributes');
    User.disableRemoteMethodByName('replaceAttributes');
    User.disableRemoteMethodByName('createChangeStream');
};
