import {getTagOrder} from '../utils/helper';

export default (Tag) => {
    Tag.getTags = (filter, callback) => {
        const {sort, used} = filter;
        filter.order = getTagOrder(sort);
        delete filter.sort;
        if (used) {
            if (used === 'question') {
                filter.where = {questionCount: {gt: 0}};
                filter.order.push('questionCount DESC');
            }
            if (used === 'post') {
                filter.where = {postCount: {gt: 0}};
                filter.order.push('postCount DESC');
            }
            delete filter.used;
        }
        Tag.find(filter, (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
