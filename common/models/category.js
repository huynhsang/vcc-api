import categoryUtils from './category/utils/categoryUtils';
import validation from './category/validation';

module.exports = function (Category) {
    // Validations
    validation(Category);

    // Utils
    categoryUtils(Category);
};
