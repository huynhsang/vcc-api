import async from 'async';
import {logInfo} from '../../../services/loggerService';

export default (Activity) => {
    Activity.removeActivityById = ({activityId}, callback) => {
        if (!activityId) {
            return callback();
        }

        async.waterfall([
            (next) => {
                Activity.findById(activityId, next);
            },
            (activity, next) => {
                if (!activity) {
                    logInfo(__('err.activity.notExist'));
                    return next();
                }
                Activity.app.models.ActivityPoint.removeByActivity(activity, next);
            },
            (next) => {
                Activity.deleteById(activityId, next);
            }
        ], (err) => {
            if (err) {
                return callback(err);
            }
            callback();
        });
    };
};
