/* global __ */
import async from 'async';
import {errorHandler, notFoundErrorHandler} from '../utils/modelHelpers';
import userVoteAnswerUtils from './userVoteAnswer/utils/userVoteAnswerUtils';

module.exports = function (UserVoteAnswer) {
    // Utils
    userVoteAnswerUtils(UserVoteAnswer);

    /**
     * Handling logic before create new Vote
     */
    UserVoteAnswer.beforeRemote('create', function (ctx, instance, next) {
        ctx.args.data.userId = ctx.args.data.createdBy = ctx.args.data.updatedBy =
            ctx.req.accessToken.userId;
        next();
    });

    /**
     * The method is responsible for handling logic before save a vote
     */
    UserVoteAnswer.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        async.waterfall([
            (cb) => {
                UserVoteAnswer.validateBeforeSave(data, cb);
            },
            (cb) => {
                if (!ctx.isNewInstance) {
                    UserVoteAnswer.findById(data.id, (err, instance) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!instance) {
                            return cb(notFoundErrorHandler(__('err.userVoteAnswer.notExists')));
                        }
                        data.isPositiveVote = !instance.isPositiveVote;
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
    UserVoteAnswer.observe('after save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        let number = data.isPositiveVote ? 1 : -1;
        if (!ctx.isNewInstance) {
            number = number * 2;
        }
        UserVoteAnswer.handleAfterSave(data, number, (err) => {
            if (err) {
                return next(errorHandler(err));
            }
            next();
        });
    });
};
