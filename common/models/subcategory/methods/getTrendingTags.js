export default (SubCategory) => {
    SubCategory.getTrendingTags = (filter, callback) => {
        filter.sort = 'popular';
        SubCategory.getDistinctTags(filter, (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
