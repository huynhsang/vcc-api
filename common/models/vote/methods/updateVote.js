import async from 'async';
import {getActivity} from '../../activity/methods/activityConstants';
import {createTask} from '../../../../queues/producers/taskManager';

const acitivities = {
    up: {
        Question: 'UP_VOTE_QUESTION',
        Answer: 'UP_VOTE_ANSWER'
    },
    down: {
        Question: 'DOWN_VOTE_QUESTION',
        Answer: 'DOWN_VOTE_ANSWER'
    }
};

export default (Vote) => {
    Vote.updateVote = (vote, action, callback) => {
        const getCurrentActivity = (next) => {
            const oldActivityName = acitivities[vote.action] && acitivities[vote.action][vote.modelType];
            Vote.app.models.Activity.findOne({
                where: {
                    activityName: oldActivityName,
                    activityModelType: vote.modelType,
                    activityModelId: vote.modelId,
                    ownerId: vote.ownerId
                }
            }, (err, activity) => {
                if (err) {
                    return next(err);
                }
                next(null, activity);
            });
        };

        const handleUpdate = (activity, next) => {
            const newActivityName = acitivities[action] && acitivities[action][vote.modelType];
            async.parallel([
                (cb) => {
                    vote.updateAttribute('action', action, cb);
                },
                (cb) => {
                    activity.updateAttribute('activityName', newActivityName, cb);
                },
                (cb) => {
                    const newActivity = getActivity(newActivityName);
                    Vote.app.models.ActivityPoint.updateAll({
                        activityId: activity.id,
                        ownerId: activity.receiverId,
                        isReceiver: true
                    }, {
                        points: newActivity.receiverPoints,
                        activityName: newActivityName
                    }, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
                }
            ], (err) => {
                if (err) {
                    return next(err);
                }
                next(null, activity.receiverId);
            });
        };

        const updateStats = (userId, next) => {
            async.parallel([
                (cb) => {
                    const taskName = vote.modelType === Vote.app.models.Answer.modelName ?
                        'UPDATE_ANSWER_STATS_TASK' : 'UPDATE_QUESTION_STATS_TASK';
                    createTask(taskName, {id: vote.modelId}, {model: Vote.modelName}, cb);
                },
                (cb) => {
                    createTask('USER_POINTS_TASK', {userId}, cb);
                }
            ], (err) => {
                next(err);
            });
        };

        async.waterfall([
            getCurrentActivity,
            handleUpdate,
            updateStats
        ], (err) => {
            if (err) {
                return callback(err);
            }
            vote.action = action;
            return callback(null, vote);
        });
    };
};
