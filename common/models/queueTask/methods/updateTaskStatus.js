import {ObjectID} from 'mongodb';

export default (QueueTask) => {
    QueueTask.updateTaskStatus = (taskId, status, callback) => {
        const mongoConnector = QueueTask.getDataSource().connector;
        mongoConnector.collection(QueueTask.modelName).findOneAndUpdate(
            {
                _id: ObjectID(String(taskId))
            },
            {
                $set: {
                    status,
                    modified: new Date()
                }
            },
            {returnOriginal: false}, (err, doc) => {
                if (err) {
                    return callback(err);
                }
                if (!doc || !doc.value) {
                    return callback();
                }
                doc.value.id = doc.value._id;
                delete doc.value._id;
                callback(null, new QueueTask(doc.value));
            }
        );
    };
};
