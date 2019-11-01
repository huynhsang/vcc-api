/* global __ */
import async from 'async';
import Joi from 'joi';
import * as shortid from 'shortid';
import {DESCRIPTION_RATE, MAX_BODY_LENGTH, MIN_BODY_LENGTH} from '../../../../configs/constants/serverConstant';
import {isActiveQuestion} from '../../question/utils/helper';
import {errorHandler, validationErrorHandler} from '../../../utils/modelHelpers';

export default (Answer) => {
    Answer.createAnswer = (loggedInUser, formData, callback) => {
        const validationFormData = (next) => {
            const schema = Joi.object().keys({
                questionId: Joi.string().hex().length(24).required(),
                body: Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required()
            }).required();

            schema.validate(formData, {allowUnknown: false}, (err, validated) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                formData = validated;
                next();
            });
        };

        const checkQuestion = (next) => {
            Answer.app.models.Question.findById(formData.questionId, (err, question) => {
                if (err) {
                    return next(err);
                }
                if (!question) {
                    return next(new Error(__('err.question.notExists')));
                }
                if (!isActiveQuestion(question)) {
                    return next(new Error(__('err.question.notActive')));
                }
                next(null, question);
            });
        };

        const saveAnswer = (question, next) => {
            const descrLength = formData.body.length / DESCRIPTION_RATE;
            const data = {
                body: formData.body,
                questionId: question.id,
                shortId: shortid.generate(),
                description: formData.body.substring(0, descrLength),
                ownerId: loggedInUser.id
            };

            Answer.create(data, (err, answer) => {
                if (err) {
                    return next(err);
                }
                next(null, answer);
            });
        };

        const updateStats = (answer, next) => {
            // TODO: Adding Job here to handle update stats. question stats & user stats
            async.parallel({
                'question': (cb) => {
                    Answer.app.models.Question.increaseAnswerCount(answer.questionId, 1, cb);
                },
                'user': (cb) => {
                    Answer.app.models.user.increaseAnswerCount(answer.ownerId, 1, cb);
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next(null, answer);
            });
        };

        async.waterfall([
            validationFormData,
            checkQuestion,
            saveAnswer,
            updateStats
        ], (err, answer) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answer);
        });
    };
};

