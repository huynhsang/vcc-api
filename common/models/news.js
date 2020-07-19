import disableRoutes from './news/disableRoutes';
import observers from './news/observers';
import validation from './news/validation';

module.exports = function (News) {
    disableRoutes(News);
    observers(News);
    validation(News);
};
