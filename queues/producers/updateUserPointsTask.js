/* global __ */
import loopback from 'loopback';
import {addTaskToQueue} from './taskManager';

export default (parameters, taskDefinition, done) => {
    const User = loopback.getModel('user');
    const {userId} = parameters;
    User.findById(userId, {fields: ['id', 'handlingPointJob']}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(new Error(__('err.user.notExists')));
        }

        // TODO: Should check the queue message instead
        if (user.handlingPointJob) {
            return done();
        }
        addTaskToQueue(parameters, taskDefinition, done);
    });
};
