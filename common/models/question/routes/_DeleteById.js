import async from 'async';
import Joi from 'joi';
import {accessDeniedErrorHandler, errorHandler} from '../../../utils/modelHelpers';
import {ADMIN_ROLE} from '../../../../configs/constants/serverConstant';

export default (Question) => {
    Question._DeleteById = (questionId, req, callback) => {
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return callback(accessDeniedErrorHandler());
        }
        const validateParams = (next) => {
            Joi.validate(questionId, Joi.string().hex().length(24).required(), (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        };

        const checkPermission = (next) => {
            loggedInUser.roles((err, roles) => {
                if (err) {
                    return next(err);
                }
                const isAdmin = roles.some((r) => r.name === ADMIN_ROLE);
                next(null, isAdmin);
            });
        };

        const removeQuestion = (isAdmin, next) => {
            Question.removeQuestion(loggedInUser.id, questionId, isAdmin, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        };

        async.waterfall([
            validateParams,
            checkPermission,
            removeQuestion
        ], (err) => {
            if (err) {
                return callback(errorHandler(err));
            }
            callback(null, {success: true});
        });
    };

    Question.remoteMethod(
        '_DeleteById',
        {
            accepts: [
                { arg: 'id', type: 'string', http: { source: 'path' } },
                { arg: 'data', type: 'object', http: { source: 'req' } }
            ],
            http: { path: '/:id', verb: 'del' },
            returns: { arg: 'result', type: 'object' }
        }
    );
};
