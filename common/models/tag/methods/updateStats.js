export default (Tag) => {
    Tag.increaseQuestionCounts = (subCategories, num, callback) => {
        const ids = subCategories.map(item => item.id);
        const mongoConnector = Tag.getDataSource().connector;
        mongoConnector.collection(Tag.modelName).updateMany(
            {
                _id: {'$in': ids}
            },
            {
                $inc: {
                    'questionCount': num
                }
            }, (err) => {
                if (err) {
                    return callback(err);
                }
                callback();
            }
        );
    };
};
