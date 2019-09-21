import getTrendingTagsRoute from './subcategory/getTrendingTagsRoute';
import getTagsRoute from './subcategory/getTagsRoute';
import subCategoryUtils from './subcategory/utils/subCategoryUtils';
import validation from './subcategory/validation';

module.exports = function (SubCategory) {
    // Validation
    validation(SubCategory);

    // Utils
    subCategoryUtils(SubCategory);

    // Routes
    getTrendingTagsRoute(SubCategory);
    getTagsRoute(SubCategory);
};
