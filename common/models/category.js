import disableRoutes from './category/disableRoutes';
import validation from './category/validation';
import getTagsByCategory from './category/methods/getTagsByCategory';
import updateStats from './category/methods/updateStats';

// Routes
import _GetTagsByCategory from './category/routes/_GetTagsByCategory';

module.exports = function (Category) {
    disableRoutes(Category);
    validation(Category);
    updateStats(Category);
    getTagsByCategory(Category);

    _GetTagsByCategory(Category);
};
