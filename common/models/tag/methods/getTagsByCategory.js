/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';
import {getTagOrder} from '../utils/helper';

export default (Tag) => {
    Tag.getTagsByCategory = (slug, filter, callback) => {
        const {limit, skip, sort, used} = filter;
        const getCategory = (next) => {
            Tag.app.models.Category.findOne({
                where: {
                    slug
                }
            }, (err, category) => {
                if (err) {
                    return next(err);
                }
                if (!category) {
                    return next(notFoundErrorHandler(__('err.category.notExists')));
                }
                next(null, category);
            });
        };

        const getTagIds = (category, next) => {
            Tag.app.models.CategoryTag.find({
                where: {
                    categoryId: category.id
                },
                fields: ['tagId']
            }, (err, result) => {
                if (err) {
                    return next(err);
                }
                const tagIds = result.map(i => i.tagId);
                next(null, tagIds);
            });
        };

        const queryTags = (tagIds, next) => {
            const where = {
                id: {
                    inq: tagIds
                }
            };
            const order = getTagOrder(sort);
            if (used) {
                if (used === 'question') {
                    where.questionCount = {gt: 0};
                    order.push('questionCount DESC');
                }
                if (used === 'post') {
                    where.postCount = {gt: 0};
                    order.push('postCount DESC');
                }
            }
            Tag.find({where, limit, skip, order}, next);
        };

        async.waterfall([
            getCategory,
            getTagIds,
            queryTags
        ], (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
