import async from 'async';
import * as shortid from 'shortid';
import {errorHandler} from '../../utils/modelHelpers';

export default function (Answer) {
    /**
     * Hide the default 'create' remote method
     */
    Answer.disableRemoteMethodByName('create');

    /**
     * Implement the customCreate function
     * @param data: {Object} The answer data
     * @param options: {Object} The options
     * @param callback: {Function} Callback function
     */
    Answer.customCreate = function (data, options, callback) {
        const createAnswer = function (next) {
            data.shortId = shortid.generate();
            Answer.create(data, options, (err, _answer) => {
                if (err) {
                    return next(err);
                }
                // here we try to load the user value
                _answer.answerBy((_err, user) => {
                    if (user) {
                        // if we found a user we add it to __data, so it appears in the output (a bit hacky way)
                        _answer.__data.answerBy = user;
                    }
                    next(null, _answer);
                });
            });
        };

        const updateNumberOfAnswer = function (answer, next) {
            const User = Answer.app.models.user;
            const Question = Answer.app.models.Question;
            async.parallel({
                'inUser': (cb) => {
                    User.updateAmountOfProperties(answer.createdBy, 'numberOfAnswers', 1, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                },
                'inQuestion': (cb) => {
                    Question.updateAmountOfProperties(answer.questionId, 'numberOfAnswers', 1, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, answer);
            });
        };

        async.waterfall([
            createAnswer,
            updateNumberOfAnswer
        ], (err, answer) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answer);
        });
    };

    /**
     * Add a custom 'customCreate' remote method
     */
    Answer.remoteMethod('customCreate', {
        description:
            'Create a new instance of the model and persist it into the data source.',
        accessType: 'WRITE',
        accepts: [
            {
                arg: 'data',
                type: 'object',
                model: 'Answer',
                allowArray: true,
                description: 'Model instance data',
                http: {source: 'body'}
            },
            {arg: 'options', type: 'object', http: 'optionsFromRequest'}
        ],
        returns: {arg: 'data', type: 'Answer', root: true},
        http: {verb: 'post', path: '/'},
        isStatic: true
    });
}
