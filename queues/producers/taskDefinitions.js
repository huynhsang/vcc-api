import {
    ACTIVITY_QUEUE,
    DEFAULT_EXCHANGE_DIRECT,
    DEFAULT_QUEUE_DELAY,
    DEFAULT_QUEUE_ATTEMPTS,
    DEFAULT_QUEUE,
    SEND_MAIL_QUEUE
} from '../queueConstant';
import updateUserPointsTask from './updateUserPointsTask';

export default {
    SEND_MAIL_TASK: (params) => (
        {
            // required: type, to, subject, html
            title: `SendMailTask to: ${params.to}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: SEND_MAIL_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: 0
        }
    ),
    ACTIVITY_TASK: (params) => (
        {
            // required: activityName, activityModelType, activityModelId,
            // optional: ownerId, receiverId
            title: `TrackActivity: ${params.activityModelType} ${params.activityModelId}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: ACTIVITY_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.Activity.trackActivity'
        }
    ),
    ACTIVITY_POINTS_TASK: (params) => (
        {
            // required: userId
            task: updateUserPointsTask,
            title: `UpdateUserPoints: ${params.userId}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: ACTIVITY_QUEUE,
            delay: 0,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.ActivityPoint.updateUserPoints'
        }
    ),
    REMOVE_VOTE_TASK: (params) => (
        {
            // required: voteId
            title: `RemoveVoteTask: ${params.voteId}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: DEFAULT_QUEUE,
            delay: 0,
            attempts: 0,
            targetRoutine: 'models.Vote.removeVote'
        }
    )
};
