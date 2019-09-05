import getTrendingTagsRoute from './subcategory/getTrendingTagsRoute';
import getTagsRoute from './subcategory/getTagsRoute';
import subCategoryUtils from './subcategory/utils/subCategoryUtils';
import validation from './subcategory/validation';

module.exports = function (SubCategory) {
    // Validation
    validation(SubCategory);

    /**
     *
     * The method is responsible for handling logic before saving SubCategory
     */
    SubCategory.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        if (!ctx.isNewInstance) {
            delete data.created;
        }
        next();
    });

    // Utils
    subCategoryUtils(SubCategory);

    // Routes
    getTrendingTagsRoute(SubCategory);
    getTagsRoute(SubCategory);
};
