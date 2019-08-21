export default function (SubCategory) {
    SubCategory.getTrendingTags = function (cb) {
        const query = `
            SELECT DISTINCT slug,
                          name_en as nameEn,
                          name_vi as nameVi,
                          SUM(number_of_questions) AS amount 
            FROM vcc.subcategory
            GROUP BY slug, name_en, name_vi
            ORDER BY amount DESC
            LIMIT 10;`;

        const connector = SubCategory.app.dataSources.vccDS.connector;
        connector.execute(query, null, (err, result) => {
            if (err) {
                return cb(err);
            }
            cb(null, result);
        });
    };

    SubCategory.remoteMethod('getTrendingTags', {
        description: 'Get trending tags',
        returns: {type: 'array', model: 'SubCategory', root: true},
        http: {path: '/trending-tags', verb: 'get'}
    });
};
