import loopbackPassport from 'loopback-component-passport';
import {logError} from '../../common/services/loggerService';
import {generatePassword} from '../../common/utils/tokenUtils';
import {USER_REALM} from '../constants/serverConstant';

export default class Passport {
    constructor (app) {
        this.app = app;
        this.passportConfigurator = new loopbackPassport.PassportConfigurator(app);
        this.passportConfigurator.init();
    }

    setup () {
        const self = this;
        // Load the provider configurations
        const config = self._loadProvider();

        self.passportConfigurator.setupModels({
            userModel: self.app.models.user,
            userIdentityModel: self.app.models.UserIdentity,
            userCredentialModel: self.app.models.UserCredential
        });

        // Configure passport strategies for third party auth providers
        for (const s in config) {
            const c = config[s];
            c.session = c.session !== false;
            c.profileToUser = this._customProfileToUser;
            this.passportConfigurator.configureProvider(s, c);
        }
    }

    _loadProvider () {
        // Load the provider configurations
        let config = {};
        try {
            config = require('./providers.json');
        } catch (err) {
            logError('Please configure your passport strategy in `providers.json`');
            process.exit(1);
        }
        return config;
    }

    _customProfileToUser (provider, profile) {
        // Let's create a user for that
        const profileEmail = profile.emails && profile.emails[0] && profile.emails[0].value;
        const generatedEmail = (profile.username || profile.id) + '@vcnc.' + (profile.provider || provider) + '.app';
        const email = profileEmail ? profileEmail : generatedEmail;
        const username = provider + '.' + (profile.username || profile.id);
        const name = profile.name || {};
        const avatarPath = profile.photos && profile.photos[0] && profile.photos[0].value;
        const avatarImage = {lrg: avatarPath, med: avatarPath, sml: avatarPath, thm: avatarPath};
        return {
            email,
            username,
            avatarImage,
            password: generatePassword(),
            firstName: name.givenName,
            lastName: name.familyName + name.middleName ? name.middleName : '',
            realm: USER_REALM,
            emailVerified: true
        };
    }
};
