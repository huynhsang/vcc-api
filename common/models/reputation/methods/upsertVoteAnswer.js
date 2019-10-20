import async from 'async';
import {APPROVE, DOWN_VOTE_POINTS, UP_VOTE_POINTS, VOTE_UP} from '../../../../configs/constants/serverConstant';

export default (Reputation) => {
    Reputation.upsertVoteAnswer = (answer, loggedInUser, type, callback) => {
        const point = type === VOTE_UP ? UP_VOTE_POINTS : DOWN_VOTE_POINTS;
        const getOrCreate = (next) => {
            const query = {
                giverId: loggedInUser.id,
                modelId: answer.id,
                modelType: Reputation.app.models.Answer.modelName,
                type: {
                    neq: APPROVE
                }
            };
            const data = {
                ...query,
                receiverId: answer.ownerId,
                point,
                type
            };
            Reputation.findOrCreate({where: query}, data, (err, instance, created) => {
                if (err) {
                    return next(err);
                }
                if (created) {
                    return next(null, instance, false);
                }
                next(null, instance, true);
            });
        };

        const updateReputation = (reputation, requireUpdate, next) => {
            if (!requireUpdate) {
                return next(null, reputation);
            }
            reputation.updateAttributes({type, point}, (err, updated) => {
                if (err) {
                    return next(err);
                }
                next(null, updated);
            });
        };

        async.waterfall([
            getOrCreate,
            updateReputation
        ], (err, reputation) => {
            if (err) {
                return callback(err);
            }
            callback(null, reputation);
        });
    };
};
