import validation from './category/validation';
import getTagsByCategory from './category/methods/getTagsByCategory';
// Routes
import getTagsByCategoryRoute from './category/getTagsByCategoryRoute';
import updateStats from './category/methods/updateStats';

module.exports = function (Category) {
    Category.disableRemoteMethodByName('createChangeStream');
    Category.disableRemoteMethodByName('prototype.updateAttributes');
    Category.disableRemoteMethodByName('prototype.__get__tags');
    Category.disableRemoteMethodByName('prototype.__findById__tags');
    Category.disableRemoteMethodByName('prototype.__create__tags');
    Category.disableRemoteMethodByName('prototype.__destroyById__tags'); // DELETE
    Category.disableRemoteMethodByName('prototype.__updateById__tags');
    validation(Category);
    updateStats(Category);
    getTagsByCategory(Category);

    getTagsByCategoryRoute(Category);
};
