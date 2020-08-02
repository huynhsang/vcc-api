export default (Tag) => {
    Tag.QUESTION_COUNT_FIELD = 'questionCount';
    Tag.POST_COUNT_FIELD = 'postCount';

    Tag.increaseCount = (subCategories, fieldName, num, callback) => {
        const ids = subCategories.map(item => item.id);
        const incField = {};
        incField[fieldName] = num;
        const mongoConnector = Tag.getDataSource().connector;
        mongoConnector.collection(Tag.modelName).updateMany(
            {
                _id: {'$in': ids}
            },
            {
                $inc: incField
            }, (err) => {
                if (err) {
                    return callback(err);
                }
                callback();
            }
        );
    };
};
