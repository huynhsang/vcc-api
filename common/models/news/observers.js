import {validationErrorHandler} from '../../utils/modelHelpers';

export default (News) => {
    News.observe('before save', (ctx, next) => {
        const data = ctx.instance || ctx.data;
        if (data && data.userId) {
            return News.app.models.user.validateUserById(data.userId, (err) => {
                if (err) {
                    return next(validationErrorHandler(err));
                }
                next();
            });
        }
        next();
    });

    News.observe('access', (ctx, next) => {
        ctx.query.include = 'user';
        next();
    });

    News.observe('loaded', (ctx, next) => {
        const news = ctx.data || {};
        news.user = News.app.models.user.toSecureObject(news.user);
        next();
    });

    // const getUserRelation = (userFunc, userId, callback) => {
    //     const User = News.app.models.user;
    //     const cbFunc = (err, user) => {
    //         if (err) {
    //             return callback(err);
    //         }
    //         if (!user) {
    //             return callback(new Error(__('err.user.notExist')));
    //         }
    //         callback(null, User.toSecureObject(user))
    //     };
    //     if (userFunc) {
    //         return userFunc(cbFunc);
    //     }
    //     User.findById(userId, cbFunc);
    // };

    // News.afterRemote('findById', (ctx, data, next) => {
    //     data.viewCount += 1;
    //     data.updateAttribute('viewCount', data.viewCount, () => {});
    //     if (typeof data.user === 'function') {
    //         return getUserRelation(data.user, null, (err, user) => {
    //             if (err) {
    //                 return next(errorHandler(err));
    //             }
    //             ctx.result.__data.user = user;
    //             next();
    //         });
    //     }
    //     next();
    // });
};
