import validation from './tag/validation';
import updateStats from './tag/methods/updateStats';
import getTags from './tag/methods/getTags';
import getTrendingTags from './tag/methods/getTrendingTags';

// Routes
import getTrendingTagsRoute from './tag/getTrendingTagsRoute';
import getTagsRoute from './tag/getTagsRoute';

module.exports = function (Tag) {
    Tag.disableRemoteMethodByName('find');

    // Validation
    validation(Tag);

    updateStats(Tag);
    getTags(Tag);
    getTrendingTags(Tag);

    // Routes
    getTrendingTagsRoute(Tag);
    getTagsRoute(Tag);
};
