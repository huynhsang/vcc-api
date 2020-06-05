// METHODS
import addPoints from './activityPoint/methods/addPoints';
import updateUserPoints from './activityPoint/methods/updateUserPoints';
import removeByActivity from './activityPoint/methods/removeByActivity';

export default function (ActivityPoint) {
    // disable remote Methods
    ActivityPoint.disableRemoteMethodByName('create');
    ActivityPoint.disableRemoteMethodByName('upsert');
    ActivityPoint.disableRemoteMethodByName('updateAll');
    ActivityPoint.disableRemoteMethodByName('updateAttributes');
    ActivityPoint.disableRemoteMethodByName('upsertWithWhere');
    ActivityPoint.disableRemoteMethodByName('createChangeStream');
    ActivityPoint.disableRemoteMethodByName('replaceOrCreate');

    addPoints(ActivityPoint);
    updateUserPoints(ActivityPoint);
    removeByActivity(ActivityPoint);
}
