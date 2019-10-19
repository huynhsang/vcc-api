import async from 'async';

module.exports = function () {
    return function (req, res, next) {
        if (!req.accessToken) {
            return next();
        }
        async.parallel({
            'currentUser': (cb) => {
                req.accessToken.user(function (err, user) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, user);
                });
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
