export default (Tag) => {
    Tag.getTags = (filter, callback) => {
        const {sort} = filter;
        const getOrder = () => {
            switch (sort) {
                case 'recent':
                    return ['id DESC'];
                case 'popular':
                    return ['questionCount DESC'];
                default:
                    return ['id ASC'];
            }
        };
        filter.order = getOrder();
        delete filter.sort;
        Tag.find(filter, (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
