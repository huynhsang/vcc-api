import {TASK_ACTIVE, TASK_PENDING} from '../../../../queues/queueConstant';

export default (QueueTask) => {
    QueueTask.getTaskByTitle = (title, callback) => {
        QueueTask.findOne({
            where: {
                title,
                status: {
                    inq: [TASK_PENDING, TASK_ACTIVE]
                }
            }
        }, (err, task) => {
            if (err) {
                return callback(err);
            }
            callback(null, task);
        });
    };
};
