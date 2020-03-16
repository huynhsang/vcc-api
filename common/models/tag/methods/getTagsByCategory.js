/* global __ */
import async from 'async';
import {notFoundErrorHandler} from '../../../utils/modelHelpers';
import {getTagOrder} from '../utils/helper';

export default (Tag) => {
    Tag.getTagsByCategory = (slug, filter, callback) => {
        const {limit, skip, sort} = filter;
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

        const queryTags = (category, next) => {
            Tag.app.models.CategoryTag.find({
                where: {
                    categoryId: category.id
                },
                include: {
                    relation: 'tag',
                    scope: {
                        order: getTagOrder(sort)
                    }
                },
                limit,
                skip
            }, (err, results) => {
                if (err) {
                    return next(err);
                }
                const tags = results.map(i => i.__data.tag);
                next(null, tags);
            });
        };

        async.waterfall([
            getCategory,
            queryTags
        ], (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
