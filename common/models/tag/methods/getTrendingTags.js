export default (Tag) => {
    Tag.getTrendingTags = (filter, callback) => {
        filter.sort = 'popular';
        Tag.getTags(filter, (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
