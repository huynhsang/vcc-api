import async from 'async';
import {getQuestionConds, getQuestionOrder} from '../utils/helper';
import {ObjectID} from 'mongodb';

export default (Question) => {
    Question.getQuestions = (query, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};

        const filter = {
            limit: query.limit,
            skip: query.skip,
            order: getQuestionOrder(query.sort),
            where: getQuestionConds(query),
            include: [
                {
                    relation: 'askedBy',
                    scope: {
                        fields: ['id', 'username', 'avatar', 'firstName', 'lastName', 'questionCount',
                            'answerCount', 'bestAnswers', 'points', 'badgeItem', 'showRealName']
                    }
                }
            ]
        };

        const addRespondentFilter = (next) => {
            // TODO: Split into another API
            if (!query.respondentId) {
                return next(null, false);
            }
            const mongoConnector = Question.getDataSource().connector;
            mongoConnector.collection(Question.app.models.Answer.modelName).aggregate([
                {
                    $match: {
                        ownerId: ObjectID(query.respondentId),
                        disabled: false
                    }
                },
                {
                    $group: {
                        _id: '$questionId'
                    }
                }
            ]).toArray((err, result) => {
                if (err) {
                    return next(err);
                }
                if (result.length > 0) {
                    const questionIds = result.map(item => item._id);
                    filter.where.and[0].id = {inq: questionIds};
                    filter.include.push({
                        relation: 'answers',
                        scope: {
                            where: {
                                ownerId: query.respondentId,
                                disabled: false
                            }
                        }
                    });
                }
                next(null, !result.length);
            });
        };

        const queryQuestions = (skip, next) => {
            if (skip) {
                return next(null, {totalCount: 0, questions: []});
            }
            async.parallel({
                'totalCount': (cb) => {
                    if (!options.totalCount) {
                        return cb(null, -1);
                    }
                    Question.count(filter.where, cb);
                },
                'questions': (cb) => {
                    Question.find(filter, cb);
                }
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (result.totalCount === -1) {
                    delete result.totalCount;
                }
                next(null, result);
            });
        };

        async.waterfall([addRespondentFilter, queryQuestions], callback);
    };
};
