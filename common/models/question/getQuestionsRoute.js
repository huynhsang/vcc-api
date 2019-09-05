import {errorHandler} from '../../utils/modelHelpers';

export default function (Question) {
    /**
     * The method will call the service to get questions
     *
     * @param filter {Object} Optional Filter JSON object.
     * @param options: {Object} The options
     * @param callback {Function} Callback function.
     */
    Question.getQuestions = function (filter, options, callback) {
        const token = options && options.accessToken;
        const userId = token && token.userId;

        if (!filter || filter.skip === undefined) {
            filter = {skip: 0};
        }
        filter.limit = filter.limit || 10;
        filter.include = [{
            relation: 'askedBy',
            scope: {
                fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
                    'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level']
            }
        }, {
            relation: 'category',
            scope: {
                fields: ['slug', 'nameEn', 'nameVi']
            }
        }];
        if (userId) {
            filter.include.push({
                relation: 'votes',
                scope: {
                    fields: ['id', 'questionId', 'userId', 'isPositiveVote', 'reason'],
                    where: {
                        userId
                    },
                    limit: 1
                }
            });
        }
        if (!filter.order) filter.order = 'created DESC';
        Question.find(filter, (err, _questions) => {
            if (err) {
                return callback(errorHandler(err));
            }
            return callback(null, _questions);
        });
    };

    /**
     * To Describe API end point to get questions
     */
    Question.remoteMethod('getQuestions', {
        accepts: [
            {arg: 'filter', type: 'object', http: {source: 'query'}},
            {arg: 'options', type: 'object', http: 'optionsFromRequest'}
        ],
        description: 'Find all questions',
        returns: {type: 'array', root: true},
        http: {path: '/find-all', verb: 'get'}
    });
}
