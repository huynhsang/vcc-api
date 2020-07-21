import disableRoutes from './post/disableRoutes';
import createPost from './post/methods/createPost';
import editPost from './post/methods/editPost';
import _Upsert from './post/routes/_Upsert';
import observers from './post/observers';

module.exports = function (Post) {
    disableRoutes(Post);
    observers(Post);
    createPost(Post);
    editPost(Post);

    _Upsert(Post);
};
