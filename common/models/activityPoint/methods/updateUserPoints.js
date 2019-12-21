import async from 'async';

export default function (ActivityPoint) {
    // track an activity
    ActivityPoint.updateUserPoints = ({userId}, done) => {
        const findUser = next => {
            ActivityPoint.app.models.user.findById(userId, next);
        };

        const handlePoints = (userInstance, next) => {
            if (!userInstance) {
                return next('updateUserPoints user does not exist');
            }

            async.waterfall([
                (cb) => {
                    const mongoConnector = ActivityPoint.getDataSource().connector;
                    mongoConnector.collection(ActivityPoint.modelName).aggregate([
                        {
                            $match: {
                                ownerId: userInstance.id
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: {
                                    $sum: '$points'
                                }
                            }
                        }
                    ]).toArray((err, results) => {
                        if (err) {
                            return cb(err);
                        }
                        if (results.length > 0) {
                            return cb(null, results[0].total);
                        }
                        cb(null, 0);
                    });
                },
                (points, cb) => {
                    userInstance.updateAttributes({
                        handlingPointJob: false,
                        points
                    }, (err, updated) => {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                        // TODO: handle badge
                    });
                }
            ], next);
        };

        async.waterfall([findUser, handlePoints], done);
    };
}
