import async from 'async';
import {getActivity} from '../../activity/methods/activityConstants';
import {createTask} from '../../../../queues/producers/taskManager';

export default function (ActivityPoint) {
    // track an activity
    ActivityPoint.addPointsByActivityInstance = (activityInstance, done) => {
        const verifyActivity = next => {
            const activity = getActivity(activityInstance.activityName);
            if (!activity) {
                next('activityName does not exist');
                return;
            }
            // verify activity model exists
            if (!ActivityPoint.app.models[activityInstance.activityModelType]) {
                next('activityModelType does not exist');
                return;
            }
            next(null, activity);
        };

        const checkBeforeCreatePoint = (activity, isReceived, next) => {
            if (!activity.limitPoints && !activity.limitPeriod) {
                return next(null, true);
            }
            const today = new Date();
            const retrieveFromDate = new Date(today - activity.limitPeriod);
            let ownerId = activity.ownerId;
            let points = activity.points;
            if (isReceived) {
                ownerId = activity.receiverId;
                points = activity.receiverPoints;
            }
            const times = activity.limitPoints / points;
            ActivityPoint.count({
                created: {'gte': retrieveFromDate},
                activityName: activity.activityName,
                ownerId
            }, (err, count) => {
                if (err) {
                    return next(err);
                }
                if (count >= times) {
                    return next(null, false);
                }
                next(null, true);
            });
        };

        const createPoints = (activity, next) => {
            const methods = [];
            // add points for owner
            if (activity.points && activityInstance.ownerId) {
                methods.push(cb => {
                    checkBeforeCreatePoint(activity, false, (err, bool) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!bool) {
                            return cb();
                        }
                        const query = {
                            where: {
                                activityName: activityInstance.activityName,
                                ownerId: activityInstance.ownerId,
                                activityId: activityInstance.id
                            }
                        };
                        ActivityPoint.findOrCreate(query, {
                            points: activity.points,
                            activityName: activityInstance.activityName,
                            ownerId: activityInstance.ownerId,
                            activityId: activityInstance.id
                        }, (_err, pointsInstance, created) => {
                            if (_err) {
                                return cb(_err);
                            }
                            if (!created) {
                                return cb();
                            }
                            // updates the user stats
                            createTask('USER_POINTS_TASK', {
                                userId: pointsInstance.ownerId
                            }, cb);
                        });
                    });
                });
            }
            // add points for receiver
            if (activity.receiverPoints && activityInstance.receiverId) {
                methods.push(cb => {
                    checkBeforeCreatePoint(activity, false, (err, bool) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!bool) {
                            return cb();
                        }
                        const query = {
                            where: {
                                activityName: activityInstance.activityName,
                                ownerId: activityInstance.receiverId,
                                activityId: activityInstance.id
                            }
                        };
                        ActivityPoint.findOrCreate(query, {
                            points: activity.receiverPoints,
                            activityName: activityInstance.activityName,
                            ownerId: activityInstance.receiverId,
                            activityId: activityInstance.id,
                            isReceiver: true
                        }, (_err, pointsInstance, created) => {
                            if (_err) {
                                return cb(_err);
                            }
                            if (!created) {
                                return cb();
                            }
                            // updates the user stats
                            createTask('USER_POINTS_TASK', {
                                userId: pointsInstance.ownerId
                            });
                            cb();
                        });
                    });
                });
            }
            async.parallel(methods, (err) => {
                next(err);
            });
        };
        async.waterfall([verifyActivity, createPoints], done);
    };
}
