import categoryUtils from './category/utils/categoryUtils';

module.exports = function (Category) {
    /**
     *
     * The method is responsible for handling logic before saving Category
     */
    Category.observe('before save', function (ctx, next) {
        const data = ctx.instance ? ctx.instance : ctx.data;
        if (!ctx.isNewInstance) {
            delete data.created;
        }
        next();
    });

    // Utils
    categoryUtils(Category);
};
