import validation from './Tag/validation';
import updateStats from './tag/methods/updateStats';
import getTags from './Tag/methods/getTags';
import getTrendingTags from './Tag/methods/getTrendingTags';

// Routes
import getTrendingTagsRoute from './Tag/getTrendingTagsRoute';
import getTagsRoute from './Tag/getTagsRoute';

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
