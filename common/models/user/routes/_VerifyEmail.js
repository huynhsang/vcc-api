/* global __ */
import async from 'async';
import Joi from 'joi';
import {errorHandler, notFoundErrorHandler, validationErrorHandler} from '../../../utils/modelHelpers';
import {createTask} from '../../../../queues/producers/taskManager';
import {VERIFICATION_EMAIL} from '../../../../configs/constants/serverConstant';

export default (User) => {
    User._VerifyEmail = (email, callback) => {
        if (Joi.string().email().trim().required().validate(email).error) {
            return callback(validationErrorHandler(__('err.invalidRequest')));
        }

        async.waterfall([
            (next) => {
                User.findOne({where: {email}}, (err, user) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return next(notFoundErrorHandler(__('err.user.notExists')));
                    }
                    if (user.emailVerified) {
                        return next(new Error(__('err.user.verified')));
                    }
                    next();
                });
            },
            (next) => {
                createTask('SEND_MAIL_TASK', {type: VERIFICATION_EMAIL, to: email}, next);
            }
        ], (err) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, {
                isSuccess: true,
                title: __('account.verification.title'),
                content: __('account.verification.content')
            });
        });
    };

    User.remoteMethod('_VerifyEmail', {
        accessType: 'WRITE',
        accepts: [
            {arg: 'email', type: 'string', http: {source: 'path'}, required: true}
        ],
        description: 'Resend verification email to user',
        returns: {arg: 'result', type: 'object'},
        http: [{path: '/:email/verify', verb: 'post'}]
    });
};
