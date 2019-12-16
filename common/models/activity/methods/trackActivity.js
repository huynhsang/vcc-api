import async from 'async';
import {getActivity} from './activityConstants';

export default function (Activity) {
    // track an activity
    Activity.trackActivity = ({activityName, activityModelType, activityModelId, ownerId, receiverId}, done) => {
        const verifyActivity = next => {
            const activity = getActivity(activityName);
            if (!activity) {
                next('activityName does not exist');
                return;
            }
            // verify activity model exists
            if (!Activity.app.models[activityModelType]) {
                next('activityModelType does not exist');
                return;
            }
            const methods = [];
            // get the id of the owner (and where the points go)
            if (typeof activity.ownerFn === 'function' && !ownerId) {
                methods.push(cb => {
                    activity.ownerFn(activityModelId, (err, _id) => {
                        if (err) {
                            cb(err);
                            return;
                        }
                        ownerId = _id;
                        cb();
                    });
                });
            }
            // get the id of the receive (where points go because of someone else)
            if (typeof activity.receiverFn === 'function' && !receiverId) {
                methods.push(cb => {
                    activity.receiverFn(activityModelId, (err, _id) => {
                        if (err) {
                            cb(err);
                            return;
                        }
                        receiverId = _id;
                        cb();
                    });
                });
            }
            async.parallel(methods, next);
        };
        const createActivity = (res, next) => {
            Activity.create({
                activityName, activityModelType, activityModelId, ownerId, receiverId
            }, next);
        };
        const addActivityPoints = (activityInstance, next) => {
            if (!activityInstance) {
                next('activityInstance does not exist');
                return;
            }
            Activity.app.models.ActivityPoint.addPointsByActivityInstance(activityInstance, next);
        };
        async.waterfall([verifyActivity, createActivity, addActivityPoints], done);
    };
}
