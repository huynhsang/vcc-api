class ServerConstant {
    constructor () {
        this.ADMIN_ROLE = 'admin';
        this.USER_ROLE = 'user';
        this.ADMIN_REALM = 'admin_realm';
        this.USER_REALM = 'user_realm';

        this.NUMBER_OF = {
            VIEWS: 'numberOfViews',
            ANDROID_VIEWS: 'numberOfAndroidViews',
            IOS_VIEWS: 'numberOfIosViews',
            COMMENTS: 'numberOfComments',
            VOTES: 'numberOfVotes'
        };

        this.SUBCATEGORY_TYPE = {
            LOCATION: 'location',
            NAME_OF_UNIVERSITY: 'name_of_university',
            FIELD_OF_STUDY: 'field_of_study',
            LEVEL: 'level',
            OTHER: 'other',
            NAME_OF_COMPANY: 'name_of_company'
        };

        this.REPUTATION_ACTION = {
            ACCEPT: 'accept',
            DOWN_VOTE: 'down vote',
            UP_VOTE: 'up vote'
        };

        this.REPUTATION_POINT = {
            ACCEPT: 15,
            DOWN_VOTE: -2,
            UP_VOTE: 10,
            POSITIVE_SUM: 12,
            NEGATIVE_SUM: -12
        };
    }
}

const serverConstant = new ServerConstant();

export default serverConstant;
