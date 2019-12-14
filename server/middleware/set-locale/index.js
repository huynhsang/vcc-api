import i18n from 'i18n';

const setLocale = () => {
    return (req, res, next) => {
        if (req.headers && req.headers['x-locale-object']) {
            try {
                const localeObject = JSON.parse(req.headers['x-locale-object']);
                i18n.setLocale(req, localeObject.locale);
                next();
            } catch (e) {
                next(e);
            }
            return;
        }
        next();
    };
};
export default setLocale;
