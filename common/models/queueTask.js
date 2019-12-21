import getTaskByTitle from './queueTask/methods/getTaskByTitle';
import initTask from './queueTask/methods/initTask';
import updateTaskStatus from './queueTask/methods/updateTaskStatus';

export default function (QueueTask) {
    getTaskByTitle(QueueTask);
    initTask(QueueTask);
    updateTaskStatus(QueueTask);
};
