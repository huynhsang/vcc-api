/* global __ */
import async from 'async';
import * as _ from 'lodash';

export default (CategoryTag) => {
    CategoryTag.addTagsToCategory = (categoryId, tagIds, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};
        if (!Array.isArray(tagIds)) {
            tagIds = [tagIds];
        }
        if (tagIds.length === 0) {
            return callback();
        }

        const checkConds = (next) => {
            async.parallel({
                'category': (cb) => {
                    if (!options.verify) {
                        return cb();
                    }
                    CategoryTag.app.models.Category.findById(categoryId, (err, category) => {
                        if (err) {
                            return cb(err);
                        }
                        if (!category) {
                            return cb(new Error(__('err.category.notExists')));
                        }
                        cb();
                    });
                },
                'tags': (cb) => {
                    if (!options.verify) {
                        return cb();
                    }
                    CategoryTag.app.models.tags.find({
                        id: {
                            inq: tagIds
                        }
                    }, (err, tags) => {
                        if (err) {
                            return cb(err);
                        }
                        if (tags.length !== tagIds.length) {
                            return cb(new Error(__('err.tag.notExists')));
                        }
                        cb();
                    });
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                next();
            });
        };

        const insertTags = (next) => {
            const results = [];
            const queue = async.queue((tagId, cb) => {
                const data = {categoryId, tagId};
                CategoryTag.findOrCreate({
                    where: data
                }, data, (err, instance) => {
                    if (err) {
                        return cb(err);
                    }
                    results.push(instance.toObject(false, true, true));
                    cb();
                });
            });

            let queueErr;
            // assign a callback
            queue.drain(() => {
                if (queueErr) {
                    return next(queueErr);
                }
                next(null, results);
            });

            // assign an error callback
            queue.error(next);

            _.forEach(tagIds, (tagId) => {
                queue.push(tagId, (err) => {
                    if (err && !queueErr) {
                        queueErr = err;
                    }
                });
            });
        };

        async.waterfall([
            checkConds,
            insertTags
        ], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    };
};
