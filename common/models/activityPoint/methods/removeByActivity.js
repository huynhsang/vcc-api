import {createTask} from '../../../../queues/producers/taskManager';

export default (ActivityPoint) => {
    ActivityPoint.removeByActivity = (activity, callback) => {
        if (!activity) {
            return callback();
        }
        ActivityPoint.destroyAll({activityId: activity.id}, (err, result) => {
            if (err) {
                return callback(err);
            }
            if (result.count > 0) {
                const options = {attribute: activity.activityModelType};
                if (activity.ownerId) {
                    createTask('UPDATE_USER_STATS_TASK', {id: activity.ownerId}, options);
                    createTask('USER_POINTS_TASK', {userId: activity.ownerId});
                }
                if (activity.receiverId) {
                    createTask('UPDATE_USER_STATS_TASK', {id: activity.receiverId}, options);
                    createTask('USER_POINTS_TASK', {userId: activity.receiverId});
                }
            }
            callback();
        });
    };
};
