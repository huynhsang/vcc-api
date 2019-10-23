export default (SubCategory) => {
    SubCategory.increaseQuestionsCounts = (subCategories, num, callback) => {
        const ids = subCategories.map(item => item.id);
        const mongoConnector = SubCategory.getDataSource().connector;
        mongoConnector.collection(SubCategory.modelName).updateMany(
            {
                _id: {'$in': ids}
            },
            {
                $inc: {
                    'questionsCount': num
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
