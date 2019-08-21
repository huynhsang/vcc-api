import * as appConstant from '../../constants/appConstant';

export default function (User) {
    User.getProfileById = function (id, cb) {
        User.findOne({
            where: {
                id,
                emailVerified: true,
                realm: appConstant.realm.user
            }
        }, (err, _user) => {
            if (err) {
                return cb(err);
            }
            if (!_user) {
                const error = new Error('Not Found');
                error.statusCode = 404;
                return cb(error);
            }
            const data = {
                id: _user.id,
                avatar: _user.avatar,
                email: _user.email,
                firstName: _user.firstName,
                lastName: _user.lastName,
                headline: _user.headline,
                points: _user.points,
                level: _user.level,
                numberOfQuestions: _user.numberOfQuestions,
                numberOfAnswers: _user.numberOfAnswers,
                numberOfBestAnswers: _user.numberOfBestAnswers
            };
            cb(null, data);
        });
    };

    User.remoteMethod('getProfileById', {
        accepts: [
            {arg: 'id', type: 'number', required: true}
        ],
        description: 'Find user by id',
        returns: {type: 'object', model: 'user', root: true},
        http: {path: '/profile', verb: 'get'}
    });
};
