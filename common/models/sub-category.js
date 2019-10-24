import validation from './subcategory/validation';
import updateStats from './subcategory/methods/updateStats';
import getDistinctTags from './subcategory/methods/getDistinctTags';
import getTrendingTags from './subcategory/methods/getTrendingTags';

import getTrendingTagsRoute from './subcategory/getTrendingTagsRoute';
import getTagsRoute from './subcategory/getTagsRoute';

module.exports = function (SubCategory) {
    // Validation
    validation(SubCategory);

    updateStats(SubCategory);
    getDistinctTags(SubCategory);
    getTrendingTags(SubCategory);

    // Routes
    getTrendingTagsRoute(SubCategory);
    getTagsRoute(SubCategory);
};
