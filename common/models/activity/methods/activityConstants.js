import loopback from 'loopback';

const MAX_LIMIT_PERIOD = 86400000; // 1 day ms
const ACTIVITIES = {
    JOIN_VCNC: {
        // ownerId is included in payload so not required as a function
        points: 10
    },
    VERIFY_EMAIL: {
        // ownerId is included in payload so not required as a function
        points: 10
    },
    POST_QUESTION: {
        ownerFn: (id, done) => {
            ownerIdFnUtility('Question', id, 'ownerId', done);
        }
    },
    POST_ANSWER: {
        ownerFn: (id, done) => {
            ownerIdFnUtility('Answer', id, 'ownerId', done);
        }
    },
    HELPFUL: {
        // ownerId is included in payload so not required as a function
        points: 1,
        receiverPoints: 3,
        limitPoints: 9,
        limitPeriod: MAX_LIMIT_PERIOD, // repeatable tasks require a MAX_LIMIT_PERIOD
        ownerFn: null, // todo requires owner!
        receiverFn: null // todo requires receiver!
    },
    LOGIN: {
        // ownerId is included in payload so not required as a function
        points: 1,
        ownerFn: null, // todo requires owner!
        limitPoints: 1,
        limitPeriod: MAX_LIMIT_PERIOD // 1 per day
    },
    FOLLOW: {
        // ownerId is included in payload so not required as a function
        points: 1,
        receiverPoints: 3,
        limitPoints: 6,
        limitPeriod: MAX_LIMIT_PERIOD // 1 per day
    },
    UNFOLLOW: {
        // ownerId is included in payload so not required as a function
        points: -2
    },
    DISABLED_ACCOUNT: {
        points: -100
    },
    REFERRAL_REGISTER: {
        points: 50,
        ownerFn: null,
        limitPoints: 200,
        limitPeriod: MAX_LIMIT_PERIOD // 1 per day
    },
    REFERRAL_QUESTION: {
        points: 50,
        ownerFn: null,
        limitPoints: 200,
        limitPeriod: MAX_LIMIT_PERIOD // 1 per day
    },
    UP_VOTE_QUESTION: {
        receiverPoints: 10
    },
    DOWN_VOTE_QUESTION: {
        receiverPoints: -5
    },
    UP_VOTE_ANSWER: {
        receiverPoints: 10
    },
    DOWN_VOTE_ANSWER: {
        receiverPoints: -5
    },
    APPROVE_ANSWER: {
        receiverPoints: 20
    }
};

const getActivity = activity => {
    return ACTIVITIES[activity];
};

export {getActivity, MAX_LIMIT_PERIOD};

const ownerIdFnUtility = (modelName, modelId, fieldName, done) => {
    if (typeof fieldName === 'function') {
        done = fieldName;
        fieldName = 'ownerId';
    }
    loopback.getModel(modelName).findOne({where: {id: modelId}, fields: fieldName}, (err, instance) => {
        if (err) {
            done(err);
            return;
        }
        if (!instance) {
            done(`Activity instance missing: model ${modelName} | id ${modelId}`);
            return;
        }
        if (!instance[fieldName]) {
            done(`Activity fieldName missing: field ${fieldName} | model ${modelName} | id ${modelId}`);
            return;
        }
        done(null, instance[fieldName]);
    });
};
