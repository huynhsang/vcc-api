import {getTagOrder} from '../utils/helper';

export default (Tag) => {
    Tag.getTags = (filter, callback) => {
        const {sort} = filter;
        filter.order = getTagOrder(sort);
        delete filter.sort;
        Tag.find(filter, (err, tags) => {
            if (err) {
                return callback(err);
            }
            callback(null, tags);
        });
    };
};
