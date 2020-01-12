// METHODS
import trackActivity from './activity/methods/trackActivity';

export default function (Activity) {
    // disable remote Methods
    Activity.disableRemoteMethodByName('create');
    Activity.disableRemoteMethodByName('upsert');
    Activity.disableRemoteMethodByName('updateAll');
    Activity.disableRemoteMethodByName('updateAttributes');
    Activity.disableRemoteMethodByName('upsertWithWhere');
    Activity.disableRemoteMethodByName('createChangeStream');
    Activity.disableRemoteMethodByName('replaceOrCreate');

    trackActivity(Activity);
}
