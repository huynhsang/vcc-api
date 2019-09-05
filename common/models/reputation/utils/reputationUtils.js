import serverConstant from '../../../../configs/constants/serverConstant';
export default function (Reputation) {
    /**
     * The method will be called after user approve an answer
     * @param answer: {Object} The answer instance
     * @param userId: {Number} The user who create the reputation
     * @param callback: {Function} The callback function
     */
    Reputation.createReputationWithAcceptAction = function (answer, userId, callback) {
        const reputation = {
            ownerId: answer.createdBy,
            action: serverConstant.REPUTATION_ACTION.ACCEPT,
            point: serverConstant.REPUTATION_POINT.ACCEPT,
            questionId: answer.questionId,
            answerId: answer.id,
            createdBy: userId,
            updatedBy: userId
        };

        Reputation.upsert(reputation, (err, _reputation) => {
            if (err) {
                return callback(err);
            }
            Reputation.app.models.user.updatePoint(_reputation, true, (_err) => {
                if (_err) {
                    return callback(_err);
                }
                callback();
            });
        });
    };
}
