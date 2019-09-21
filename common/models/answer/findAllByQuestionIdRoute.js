export default function (Answer) {
    /**
     * The method will call the service to get answers by question Id
     *
     * @param id {Number} The question Id
     * @param filter {Object} Optional Filter JSON object.
     * @param options: {Object} The options
     * @param callback {Function} Callback function.
     */
    Answer.finAllByQuestionId = function (id, filter = {}, options, callback) {
        const token = options && options.accessToken;
        const userId = token && token.userId;

        if (!filter || !filter.skip) {
            filter = {skip: 0};
        }
        filter.limit = 10;
        filter.include = [{
            relation: 'answerBy',
            scope: {
                fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
                    'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level']
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
        filter.where = {
            questionId: id
        };
        filter.order = 'createdOn DESC';

        Answer.find(filter, (err, _answers) => {
            if (err) {
                return callback(err);
            }
            callback(null, _answers);
        });
    };

    /**
     * To Describe API end point to get answers by question Id
     */
    Answer.remoteMethod('finAllByQuestionId', {
        accepts: [
            {arg: 'id', type: 'number', required: true, description: 'Question Id'},
            {arg: 'filter', type: 'object', http: {source: 'query'}},
            {arg: 'options', type: 'object', http: 'optionsFromRequest'}
        ],
        description: 'Find all Answers By question Id',
        returns: {type: 'array', root: true},
        http: {path: '/find-all-by-question-id', verb: 'get'}
    });
}
