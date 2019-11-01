import async from 'async';
import loopback from 'loopback';

module.exports = function () {
    return (req, res, next) => {
        if (!req.accessToken) {
            return next();
        }
        async.parallel({
            'currentUser': (cb) => {
                if (!req.accessToken.userId) {
                    return cb();
                }
                loopback.getModel('user').findById(req.accessToken.userId, {},  cb);
            }
        }, (err, result) => {
            if (err) {
                return next(err);
            }
            req.user = result.currentUser;
            next();
        });
    };
};
