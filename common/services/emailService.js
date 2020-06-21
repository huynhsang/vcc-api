import Joi from 'joi';
import loopback from 'loopback';
import path from 'path';
import config from '../../configs/global/config.global';
import {logInfo} from './loggerService';

class EmailService {
    send (payload, callback) {
        logInfo(`SENDING EMAIL TO: ${payload.to}`);
        payload.from = config.SENDER_EMAIL;
        const schema = Joi.object().keys({
            to: Joi.string().trim().email().required(),
            subject: Joi.string().trim().required()
        });
        const results = Joi.validate(payload, schema, {allowUnknown: true});
        if (results.error) {
            return callback(results.error);
        }

        if (payload.templateName) {
            const renderer = loopback.template(path.resolve(__dirname, `../templates/${payload.templateName}`));
            payload.html = renderer(payload);
        }

        loopback.getModel('Email').send(payload, (err) => {
            if (err) {
                return callback(err);
            }
            callback();
        });
    }
}

export default new EmailService();
