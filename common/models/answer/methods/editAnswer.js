import async from 'async';
import Joi from 'joi';
import {DESCRIPTION_RATE, MAX_BODY_LENGTH, MIN_BODY_LENGTH} from '../../../../configs/constants/serverConstant';
import {errorHandler, permissionErrorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import {canEditAnswer, isActiveAnswer} from '../utils/helper';

export default (Answer) => {
    Answer.editAnswer = (loggedInUser, formData, callback) => {
        const validationFormData = (next) => {
            const schema = Joi.object().keys({
                id: Joi.string().hex().length(24).required(),
                body: Joi.string().trim().min(MIN_BODY_LENGTH).max(MAX_BODY_LENGTH).required()
            }).required();

            schema.validate(formData, {allowUnknown: false}, (err, validated) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                formData = validated;
            });
        };

        const getAnswer = (next) => {
            Answer.findById(formData.id, (err, answer) => {
                if (err) {
                    return next(err);
                }
                if (!answer) {
                    return next(new Error(__('err.question.notExists')));
                }
                if (!isActiveAnswer(answer)) {
                    return next(new Error(__('err.answer.notActive')));
                }
                if (answer.upVotesCount > 0 || answer.downVotesCount > 0) {
                    return next(new Error(__('err.answer.voted')));
                }
                next(null, answer);
            });
        };

        const checkPermission = (answer, next) => {
            canEditAnswer(loggedInUser, answer, (err, hasPermission) => {
                if (err) {
                    return next(err);
                }
                if (!hasPermission) {
                    return next(permissionErrorHandler());
                }
                next(null, answer);
            });
        };

        const updateAnswer = (answer, next) => {
            const descrLength = formData.body.length / DESCRIPTION_RATE;
            const mongoConnector = Answer.getDataSource().connector;
            mongoConnector.collection(Answer.modelName).findAndModify(
                {
                    _id: answer.id,
                    disabled: false,
                    upVotesCount: 0,
                    downVotesCount: 0,
                    '$or': [
                        {pendingUserIds: {'$exists': false}},
                        {pendingUserIds: {'$size': 0}}
                    ]
                },
                [],
                {
                    '$set': {
                        body: formData.body,
                        description: formData.body.substring(0, descrLength),
                        modified: new Date()
                    }
                },
                {new: true}, (err, doc) => {
                    if (err) {
                        return next(err);
                    }
                    if (!doc || !doc.value) {
                        return next(new Error(__('err.answer.notMatchConds')));
                    }
                    doc.value.id = doc.value._id;
                    delete doc.value._id;
                    next(null, new Answer(doc.value));
                }
            );
        };

        async.waterfall([
            validationFormData,
            getAnswer,
            checkPermission,
            updateAnswer
        ], (err, answer) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, answer);
        });
    };
};

