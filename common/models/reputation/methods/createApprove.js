import {APPROVE, APPROVE_POINTS} from '../../../../configs/constants/serverConstant';

export default (Reputation) => {
    Reputation.createApprove = (question, answer, callback) => {
        const query = {
            giverId: question.ownerId,
            modelId: answer.id,
            modelType: Reputation.app.models.Answer.modelName,
            type: APPROVE
        };
        const data = {
            receiverId: answer.ownerId,
            point: APPROVE_POINTS,
            ...query
        };

        Reputation.findOrCreate({where: query}, data, (err, instance) => {
            if (err) {
                return callback(err);
            }
            callback(null, instance);
        });
    };
};
