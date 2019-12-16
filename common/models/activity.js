// METHODS
import trackActivity from './activity/methods/trackActivity';

export default function (Activity) {
    // disable remote Methods
    Activity.disableRemoteMethod('create');
    Activity.disableRemoteMethod('upsert');
    Activity.disableRemoteMethod('updateAll');
    Activity.disableRemoteMethod('updateAttributes');
    Activity.disableRemoteMethod('upsertWithWhere');
    Activity.disableRemoteMethod('createChangeStream');
    Activity.disableRemoteMethod('replaceOrCreate');

    trackActivity(Activity);
}
