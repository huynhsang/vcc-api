import async from 'async';

export default function (ActivityPoint) {
    // track an activity
    ActivityPoint.updateUserPoints = ({userId}, done) => {
        const User = ActivityPoint.app.models.user;
        const today = new Date();

        const findUser = next => {
            User.findById(userId, next);
        };

        const handlePoints = (userInstance, next) => {
            if (!userInstance) {
                next('updateUserPoints user does not exist');
                return;
            }
            const lastUpdatePoints = userInstance.pointsUpdateOn || userInstance.created;
            const query = {where: {ownerId: userInstance.id, created: {gt: new Date(lastUpdatePoints), lte: today}}};

            async.waterfall([
                (cb) => {
                    ActivityPoint.find(query, (err, pointInstances) => {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, pointInstances.reduce((total, item) => total + item.points, 0));
                    });
                },
                (updatePoints, cb) => {
                    const newPoints = userInstance.points + updatePoints;

                    userInstance.updateAttributes({
                        points: newPoints,
                        pointsUpdateOn: today,
                        handlingPointJob: false
                    }, (err) => {
                        cb(err);
                        // TODO: handle badge
                    });
                }
            ], next);
        };

        async.waterfall([findUser, handlePoints], done);
    };
}
