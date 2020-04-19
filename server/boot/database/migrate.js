import path from 'path';
import fs from 'fs';
import async from 'async';
import {logInfo} from '../../../common/services/loggerService';

export default (app, callback) => {
    const Migration = app.models.Migration;
    const migrationsPath = path.join(__dirname, '/migrations');
    const migrations = fs.readdirSync(migrationsPath);
    async.eachSeries(migrations, (fileName, next) => {
        const task = require(`./migrations/${fileName}`);
        const data = {name: fileName, version: task.version};
        Migration.findOne({where: data}, (err, instance) => {
            if (err) {
                return next(err);
            }
            if (instance) {
                return next();
            }
            logInfo(`Applying migration file: ${fileName}...`);
            task.run(app, (_err) => {
                if (_err) {
                    return next(_err);
                }
                logInfo(`Applied migration file: ${fileName}.`);
                Migration.create(data, next);
            });
        });
    }, callback);
};
