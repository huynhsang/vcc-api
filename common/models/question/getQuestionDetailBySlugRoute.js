/* global __ */
import {errorHandler, notFoundErrorHandler} from '../../utils/modelHelpers';

export default function (Question) {
    /**
     * The method will call the service to get question detail
     *
     * @param slug {String} The question slug
     * @param options: {Object} The options
     * @param callback {Function} Callback function.
     */
    Question.getQuestionDetailBySlug = function (slug, options, callback) {
        const token = options && options.accessToken;
        const userId = token && token.userId;
        const filter = {};
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
        }, {
            relation: 'answers',
            scope: {
                skip: 0,
                limit: 10,
                order: 'createdOn DESC',
                include: [{
                    relation: 'answerBy',
                    scope: {
                        fields: ['id', 'avatar', 'firstName', 'lastName', 'numberOfQuestions',
                            'numberOfAnswers', 'numberOfBestAnswers', 'points', 'level']
                    }
                }]
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
            filter.include[2].scope.include.push({
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
            isHidden: false,
            isVerified: true,
            slug
        };
        filter.order = 'updatedOn DESC';
        Question.findOne(filter, (err, _question) => {
            if (err) {
                return callback(errorHandler(err));
            }
            if (!_question) {
                return callback(notFoundErrorHandler(__('err.question.notExists')));
            }
            callback(null, _question);
        });
    };

    /**
     * To Describe API end point to get questions
     */
    Question.remoteMethod('getQuestionDetailBySlug', {
        accepts: [
            {arg: 'slug', type: 'string', required: true},
            {arg: 'options', type: 'object', http: 'optionsFromRequest'}
        ],
        description: 'Get question detail by Id',
        returns: {type: 'object', root: true},
        http: {path: '/get-detail', verb: 'get'}
    });
}
