import * as async from 'async';
import * as _ from 'lodash';
import {errorHandler} from '../../utils/modelHelpers';

export default (Post) => {
    Post.observe('access', (ctx, next) => {
        ctx.query.include = 'author';
        next();
    });

    const getExperiecesForCharacters = (characters, callback) => {
        const output = [];
        if (!characters || characters.length === 0) {
            return callback(null, output);
        }
        const queue = async.queue((character, next) => {
            Post.app.models.Experience.find({where: {ownerId: character.id}}, (err, experiences) => {
                if (err) {
                    return next(errorHandler(err));
                }
                character.experiences = experiences;
                output.push(character);
                next();
            });
        }, 1);

        queue.drain(() => {
            callback(null, output);
        });

        // assign an error callback
        queue.error(callback);

        _.forEach(characters, (character) => {
            if (typeof character.toObject === 'function') {
                character = character.toObject();
            }
            queue.push(character, () => {
            });
        });
    };

    Post.observe('loaded', (ctx, next) => {
        const post = ctx.data || {};
        post.author = Post.app.models.user.toSecureObject(post.author);
        next();
    });

    Post.afterRemote('findById', (ctx, post, next) => {
        if (post) {
            return getExperiecesForCharacters(post.characterList, (err, characters) => {
                if (err) {
                    return next(errorHandler(err));
                }
                ctx.result = ctx.result.toObject();
                ctx.result.characterList = characters;
                next();
            });
        }
        next();
    });

    Post.afterRemote('find', (ctx, posts, next) => {
        const results = [];
        if (!posts || posts.length === 0) {
            return next(null, results);
        }
        const queue = async.queue((post, cb) => {
            getExperiecesForCharacters(post.characterList, (err, characters) => {
                if (err) {
                    return cb(errorHandler(err));
                }
                post.characterList = characters;
                results.push(post);
                cb();
            });
        }, 5);

        queue.drain(() => {
            ctx.result = results;
            next();
        });

        // assign an error callback
        queue.error(next);

        _.forEach(posts, (post) => {
            queue.push(post.toObject(), () => {
            });
        });
    });
};
