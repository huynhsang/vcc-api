export default {
    'facebook-login': {
        'provider': 'facebook',
        'module': 'passport-facebook',
        'profileFields': ['gender', 'link', 'locale', 'name', 'timezone', 'about',
            'verified', 'email', 'updated_time', 'picture.type(large)', 'birthday'],
        'clientID': process.env.FACEBOOK_CLIENT_ID,
        'clientSecret': process.env.FACEBOOK_CLIENT_SECRET,
        'callbackURL': '/auth/facebook/callback',
        'authPath': '/auth/facebook',
        'callbackPath': '/auth/facebook/callback',
        'successRedirect': '/auth/account',
        'failureRedirect': process.env.FAILURE_REDIRECT,
        'scope': ['email', 'public_profile'],
        'failureFlash': true
    },
    'google-login': {
        'provider': 'google',
        'module': 'passport-google-oauth',
        'strategy': 'OAuth2Strategy',
        'clientID': process.env.GOOGLE_CLIENT_ID,
        'clientSecret': process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL': '/auth/google/callback',
        'authPath': '/auth/google',
        'callbackPath': '/auth/google/callback',
        'successRedirect': '/auth/account',
        'failureRedirect': process.env.FAILURE_REDIRECT,
        'scope': ['email', 'profile'],
        'failureFlash': true
    }
};
