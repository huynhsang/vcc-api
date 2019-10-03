/* global __ */
import async from 'async';
import {errorHandler, notFoundErrorHandler} from '../utils/modelHelpers';
import userVoteQuestionUtils from './userVoteQuestion/utils/userVoteQuestionUtils';

module.exports = function (UserVoteQuestion) {
    // Utils
    userVoteQuestionUtils(UserVoteQuestion);

    /**
     * Handling logic before create new Vote
     */
    UserVoteQuestion.beforeRemote('create', function (ctx, instance, next) {
        ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
            ctx.req.accessToken.userId;
        next();
    });

    /**
     * The method is responsible for handling logic before save a vote
     */
    UserVoteQuestion.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        async.waterfall([
            (cb) => {
                UserVoteQuestion.validateBeforeSave(data, cb);
            },
            (cb) => {
                if (!ctx.isNewInstance) {
                    UserVoteQuestion.findById(data.id, (err, instance) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!instance) {
                            return cb(notFoundErrorHandler(__('err.userVoteQuestion.notExists')));
                        }
                        data.isPositiveVote = !instance.isPositiveVote;
                        cb();
                    });
                } else {
                    cb();
                }
            }
        ], (err) => {
            if (err) {
                return next(errorHandler(err));
            }
            next();
        });
    });

    /**
     * The method is responsible for handling logic after save a vote
     */
    UserVoteQuestion.observe('after save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        let number = data.isPositiveVote ? 1 : -1;
        if (!ctx.isNewInstance) {
            number = number * 2;
        }
        UserVoteQuestion.handleAfterSave(data, number, (err) => {
            if (err) {
                return next(errorHandler(err));
            }
            next();
        });
    });
};
