import {accessDeniedErrorHandler} from '../../../utils/modelHelpers';

export default (Post) => {
    Post._Upsert = (req, data, callback) => {
        const method = req.method.toLowerCase();
        const loggedInUser = req.user;

        if (!loggedInUser || !loggedInUser.id) {
            return callback(accessDeniedErrorHandler());
        }

        if (method === 'put') {
            return Post.editPost(loggedInUser, data, callback);
        }
        Post.createPost(loggedInUser, data, callback);
    };

    Post.remoteMethod('_Upsert', {
        description: 'Create a new instance of the model and persist it into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Post',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'object', model: 'Post', root: true},
        http: {verb: 'post', path: '/'},
        isStatic: true
    });

    Post.remoteMethod('_Upsert', {
        description: 'Replace an existing model instance or insert a new one into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Post',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'object', model: 'Post', root: true},
        http: {verb: 'put', path: '/'},
        isStatic: true
    });
};
