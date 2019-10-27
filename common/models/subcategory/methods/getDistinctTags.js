export default (SubCategory) => {
    SubCategory.getDistinctTags = (filter, callback) => {
        const {limit, skip, sort} = filter;
        const getSort = () => {
            switch (sort) {
                case 'recent':
                    return {_id: -1};
                case 'popular':
                    return {amount: -1};
                default:
                    return {_id: 1};
            }
        };
        const pipeline = [
            {
                $group: {
                    _id: null,
                    slug: {$first: '$slug'},
                    nameEn: {$first: '$nameEn'},
                    nameVi: {$first: '$nameVi'},
                    amount: {$sum: '$questionsCount'}
                }
            },
            {
                $sort: getSort()
            },
            {
                $limit: limit
            },
            {
                $skip: skip
            }
        ];
        const mongoConnector = SubCategory.getDataSource().connector;
        mongoConnector.collection(SubCategory.modelName).aggregate(pipeline).toArray((err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    };
};
