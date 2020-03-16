import disableRoutes from './tag/disableRoutes';
import validation from './tag/validation';
import updateStats from './tag/methods/updateStats';
import getTags from './tag/methods/getTags';
import getTrendingTags from './tag/methods/getTrendingTags';
import getTagsByCategory from './tag/methods/getTagsByCategory';

// Routes
import _GetTrendingTags from './tag/routes/_GetTrendingTags';
import _GetTags from './tag/routes/_GetTags';

module.exports = function (Tag) {
    disableRoutes(Tag);

    // Validation
    validation(Tag);

    updateStats(Tag);
    getTags(Tag);
    getTrendingTags(Tag);
    getTagsByCategory(Tag);

    // Routes
    _GetTrendingTags(Tag);
    _GetTags(Tag);
};
