import {
    ACTIVITY_QUEUE,
    DEFAULT_EXCHANGE_DIRECT,
    DEFAULT_QUEUE_DELAY,
    DEFAULT_QUEUE_ATTEMPTS,
    DEFAULT_QUEUE,
    SEND_MAIL_QUEUE
} from '../queueConstant';

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
            title: `TrackActivityTask: ${params.activityModelType} ${params.activityModelId}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: ACTIVITY_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.Activity.trackActivity'
        }
    ),
    USER_POINTS_TASK: (params) => (
        {
            // required: userId
            title: `UpdateUserPointsTask: ${params.userId}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: ACTIVITY_QUEUE,
            delay: 0,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.ActivityPoint.updateUserPoints',
            unique: true
        }
    ),
    UPDATE_ANSWER_STATS_TASK: (params) => (
        {
            // required: answerId, options
            title: `UpdateAnswerStatsTask: ${params.id} model: ${params.options.model}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: DEFAULT_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.Answer.updateStats',
            unique: true
        }
    ),
    UPDATE_QUESTION_STATS_TASK: (params) => (
        {
            // required: id, options
            title: `UpdateQuestionStatsTask: ${params.id} model: ${params.options.model}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: DEFAULT_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.Question.updateStats',
            unique: true
        }
    ),
    UPDATE_USER_STATS_TASK: (params) => (
        {
            // required: id, options
            title: `UpdateUserStatsTask: ${params.id} attribute: ${params.options.attribute}`,
            exchange: DEFAULT_EXCHANGE_DIRECT,
            routingKey: DEFAULT_QUEUE,
            delay: DEFAULT_QUEUE_DELAY,
            attempts: DEFAULT_QUEUE_ATTEMPTS,
            targetRoutine: 'models.user.updateStats',
            unique: true
        }
    )
};
