export default function (SubCategory) {
    SubCategory.getTags = function (cb) {
        const query = `
            SELECT DISTINCT slug,
                          name_en AS nameEn,
                          name_vi AS nameVi,
                          SUM(number_of_questions) AS amount 
            FROM vcc.subcategory
            GROUP BY slug, name_en, name_vi
            ORDER BY amount DESC
            LIMIT 100;`;

        const connector = SubCategory.app.dataSources.vccDS.connector;
        connector.execute(query, null, (err, result) => {
            if (err) {
                return cb(err);
            }
            cb(null, result);
        });
    };

    SubCategory.remoteMethod('getTags', {
        description: 'Get tags',
        returns: {type: 'array', model: 'SubCategory', root: true},
        http: {path: '/all', verb: 'get'}
    });
};
