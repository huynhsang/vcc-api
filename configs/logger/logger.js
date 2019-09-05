import fs from 'fs';
import path from 'path';
import {createLogger, format, transports} from 'winston';
import 'winston-daily-rotate-file';

const LOG_DIR = path.resolve(__dirname, '../../logs/');
// Create the directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const logger = createLogger({
    format: format.combine(
        format.label({label: path.basename(process.mainModule.filename)}),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.json()
    ),
    exitOnError: false,
    transports: [
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            format: format.combine(
                format.colorize(),
                format.printf(
                    info =>
                        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
        }),
        new (transports.DailyRotateFile)({
            dirname: LOG_DIR,
            filename: 'api-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            json: true,
            colorize: false,
            handleExceptions: true,
            level: 'info'
        })
    ]
});

export default logger;

