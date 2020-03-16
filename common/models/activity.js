// METHODS
import trackActivity from './activity/methods/trackActivity';
import disableRoutes from './activity/disableRoutes';

export default function (Activity) {
    disableRoutes(Activity);

    trackActivity(Activity);
}
