/* global __ */
import async from 'async';
import {getActivity} from '../../activity/methods/activityConstants';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Vote) => {
    Vote.removeVote = ({voteId}, callback) => {
        const getVote = (next) => {
            Vote.findById(voteId, {
                include: 'model'
            }, (err, vote) => {
                if (err) {
                    return next(err);
                }
                if (!vote) {
                    return next(new Error(__('err.vote.notExists')));
                }
                next(null, vote.toObject(false, false, false));
            });
        };

        const getActivityInstance = (vote, next) => {
            Vote.app.models.Activity.findOne({
                ownerId: vote.ownerId,
                activityModelId: vote.modelId,
                activityModelType: vote.modelType,
                receiverId: vote.model.ownerId
            }, (err, activity) => {
                if (err) {
                    return next(err);
                }
                if (!activity) {
                    return next(new Error(__('err.activity.notExists')));
                }
                next(null, vote, activity.toObject());
            });
        };

        const updateStats = (vote, activity, next) => {
            async.parallel([
                (cb) => {
                    const voteActivity = getActivity(activity.activityName);
                    const incPoints = 0 - voteActivity.receiverPoints;
                    return Vote.app.models.user.updateAll({
                        id: activity.receiverId
                    }, {
                        $set: {
                            updatedOn: new Date()
                        },
                        $inc: {
                            points: incPoints
                        }
                    }, (err) => {
                        cb(err);
                    });
                },
                (cb) => {
                    const attribute = vote.action === VOTE_UP ? 'upVoteCount' : 'downVoteCount';
                    Vote.app.models[vote.modelType].increaseCount(vote.modelId, attribute, -1, cb);
                }
            ], (err) => {
                next(err);
            });
        };

        const handleRemove = (vote, activity, next) => {
            async.parallel([
                (cb) => {
                    Vote.destroyById(vote.id, cb);
                },
                (cb) => {
                    Vote.app.models.ActivityPoint.destroyAll({
                        ownerId: activity.receiverId,
                        isReceiver: true,
                        activityId: activity.id
                    }, (err, info) => {
                        if (err) {
                            return cb(err);
                        }
                        if (info.count > 0) {
                            return updateStats(vote, activity, cb);
                        }
                        cb();
                    });
                },
                (cb) => {
                    Vote.app.models.Activity.destroyById(activity.id, cb);
                }
            ], (err) => {
                next(err);
            });
        };

        async.waterfall([getVote, getActivityInstance, handleRemove], callback);
    };
};