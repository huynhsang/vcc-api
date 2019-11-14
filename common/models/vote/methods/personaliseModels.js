export default (Vote) => {
    Vote.personaliseModels = (userId, models, modelName, callback) => {
        if (!userId || !models) {
            return callback(null, models);
        }

        let data = models;
        if (!Array.isArray(models)) {
            data = [models];
        }
        const modelIds = data.map(q => q.id);
        const filter = {
            where: {
                ownerId: userId,
                modelId: {inq: modelIds},
                modelType: modelName
            }
        };
        Vote.find(filter, (err, votes) => {
            if (err) {
                return callback(err);
            }
            const votedModelIds = {};
            for (let i = 0, length = votes.length; i < length; i++) {
                votedModelIds[String(votes[i].modelId)] = votes[i].action;
            }
            callback(null, votedModelIds);
        });
    };
};
