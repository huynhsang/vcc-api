// METHODS
import trackActivity from './activity/methods/trackActivity';
import disableRoutes from './activity/disableRoutes';
import removeActivity from './activity/methods/removeActivity';

export default function (Activity) {
    disableRoutes(Activity);

    trackActivity(Activity);
    removeActivity(Activity)
}
