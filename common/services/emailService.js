import Joi from 'joi';
import loopback from 'loopback';
import {logInfo} from './loggerService';

class EmailService {
    send (payload, callback) {
        logInfo(`SENDING EMAIL TO: ${payload.to}`);
        const schema = Joi.object().keys({
            from: Joi.string().trim().email().required(),
            to: Joi.string().trim().email().required(),
            subject: Joi.string().trim().required()
        });
        const results = Joi.validate(payload, schema, {allowUnknown: true});
        if (results.error) {
            return callback(results.error);
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
