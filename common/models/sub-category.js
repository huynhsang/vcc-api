import getTrendingTagsRoute from './subcategory/getTrendingTagsRoute';
import getTagsRoute from './subcategory/getTagsRoute';
import validation from './subcategory/validation';
import updateStats from './subcategory/methods/updateStats';

module.exports = function (SubCategory) {
    // Validation
    validation(SubCategory);

    updateStats(SubCategory);

    // Routes
    getTrendingTagsRoute(SubCategory);
    getTagsRoute(SubCategory);
};
