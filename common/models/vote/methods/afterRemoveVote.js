/* global __ */
import async from 'async';
import {getActivity} from '../../activity/methods/activityConstants';
import {VOTE_UP} from '../../../../configs/constants/serverConstant';
import {ObjectID} from 'mongodb';

export default (Vote) => {
    Vote.afterRemoveVote = ({modelId, modelType, ownerId, action}, callback) => {
        const getModel = (next) => {
            Vote.app.models[modelType].findById(modelId, next);
        };

        const getActivityInstance = (model, next) => {
            Vote.app.models.Activity.findOne({
                where: {
                    ownerId,
                    activityModelId: modelId,
                    activityModelType: modelType,
                    receiverId: model.ownerId
                }
            }, (err, activity) => {
                if (err) {
                    return next(err);
                }
                if (!activity) {
                    return next(new Error(__('err.activity.notExists')));
                }
                next(null, activity.toObject());
            });
        };

        const updateStats = (activity, next) => {
            async.parallel([
                (cb) => {
                    const voteActivity = getActivity(activity.activityName);
                    const incPoints = 0 - voteActivity.receiverPoints;
                    const mongoConnector = Vote.getDataSource().connector;
                    mongoConnector.collection(Vote.app.models.user.modelName).findOneAndUpdate(
                        {
                            _id: ObjectID(String(activity.receiverId))
                        },
                        {
                            $set: {
                                modified: new Date()
                            },
                            $inc: {
                                points: incPoints
                            }
                        }, (err) => {
                            cb(err);
                        }
                    );
                },
                (cb) => {
                    const attribute = action === VOTE_UP ? 'upVoteCount' : 'downVoteCount';
                    Vote.app.models[modelType].increaseCount(modelId, attribute, -1, cb);
                }
            ], (err) => {
                next(err);
            });
        };

        const handleRemove = (activity, next) => {
            async.parallel([
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
                            return updateStats(activity, cb);
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

        async.waterfall([getModel, getActivityInstance, handleRemove], callback);
    };
};
