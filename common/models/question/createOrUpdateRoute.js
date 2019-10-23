import {accessDeniedErrorHandler} from '../../utils/modelHelpers';

export default (Question) => {
    /**
     * Implement the customCreate function
     * @param req: {Object} The request
     * @param data: {Object} The Question data
     * @param callback: {Function} Callback function
     */
    Question.createOrUpdate = function (req, data, callback) {
        const method = req.method.toLowerCase();
        const loggedInUser = req.user;

        if (!loggedInUser || !loggedInUser.id) {
            return callback(accessDeniedErrorHandler());
        }

        if (method === 'put') {
            return Question.editQuestion(loggedInUser, data, callback);
        }
        Question.createQuestion(loggedInUser, data, callback);
    };

    Question.remoteMethod('createOrUpdate', {
        description: 'Create a new instance of the model and persist it into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Question',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'object', model: 'Question', root: true},
        http: {verb: 'post', path: '/'},
        isStatic: true
    });

    Question.remoteMethod('createOrUpdate', {
        description: 'Replace an existing model instance or insert a new one into the data source.',
        accessType: 'WRITE',
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'req'}},
            {
                arg: 'data',
                type: 'object',
                model: 'Question',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            }
        ],
        returns: {arg: 'data', type: 'object', model: 'Question', root: true},
        http: {verb: 'put', path: '/'},
        isStatic: true
    });
};
