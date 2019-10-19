import {accessDeniedErrorHandler} from '../../utils/modelHelpers';

export default function (Answer) {
    /**
     * Hide the default 'create' remote method
     */
    Answer.disableRemoteMethodByName('create');

    /**
     * Implement the customCreate function
     * @param req: {Object} The request
     * @param data: {Object} The answer data
     * @param callback: {Function} Callback function
     */
    Answer.createOrUpdate = function (req, data, callback) {
        const method = req.method.toLowerCase();
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return callback(accessDeniedErrorHandler());
        }

        if (method === 'put') {
            return Answer.editAnswer(loggedInUser, data, callback);
        }
        Answer.createAnswer(loggedInUser, data, callback);
    };

    Answer.remoteMethod('createOrUpdate', {
        description: 'Create a new instance of the model and persist it into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Answer',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'Answer', root: true},
        http: {verb: 'post', path: '/'},
        isStatic: true
    });

    Answer.remoteMethod('createOrUpdate', {
        description: 'Replace an existing model instance or insert a new one into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Answer',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'Answer', root: true},
        http: {verb: 'put', path: '/'},
        isStatic: true
    });
}
