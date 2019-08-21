const loopback = require('loopback');
const formatter = {};

// Formatting date to save into Mysql datetime field
formatter.dateToString = function (date) {
    return date.getUTCFullYear() + '/' +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' +
        ('0' + date.getUTCDate()).slice(-2) + ' ' +
        ('0' + date.getUTCHours()).slice(-2) + ':' +
        ('0' + date.getUTCMinutes()).slice(-2) + ':' +
        ('0' + date.getUTCSeconds()).slice(-2);
};

formatter.stringToGeoPoint = function (point) {
    // To handle that string: "POINT (108.4380989999999940 11.9436929999999997)"
    if (point) {
        const points = point.slice(7, -1).split(' ');
        return new loopback.GeoPoint({
            lat: parseFloat(points[1]),
            lng: parseFloat(points[0])
        });
    }
    return null;
};

formatter.jsonResponseSuccess = function (res, body) {
    res.set({
        'Content-type': 'application/json; charset=utf-8'
    });
    res.status(200).json({
        isSuccess: true,
        data: body
    });
};

formatter.responseError = function (res, err, status = 500) {
    res.set({
        'Content-type': 'application/json; charset=utf-8'
    });
    res.status(status).json({
        isSuccess: false,
        error: err
    });
};

/**
 * The method is responsible for formatting string with arguments
 * @param text: a String need to format
 * @param args: an array of values will put to the text
 * @return {*} a formatted string
 */
formatter.string = function (text, args = []) {
    if (Array.isArray(args)) {
        for (const k in args) {
            text = text.replace(new RegExp('\\{' + k + '\\}', 'g'), args[k]);
        }
    }
    return text;
};

module.exports = formatter;
