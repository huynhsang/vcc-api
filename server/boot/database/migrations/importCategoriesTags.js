import fs from 'fs';
import async from 'async';
import parse from 'csv-parse';
import path from 'path';

const migration = {
    version: 'v1'
};

migration.run = (app, callback) => {
    const Category = app.models.Category;
    const Tag = app.models.Tag;
    const CategoryTag = app.models.CategoryTag;
    const FILE_PATH = path.resolve(__dirname, '../data/categories_tags_v1_20-04-2020.csv');

    const categoryMaps = {};
    const tagMaps = {};

    const findOrCreateCategory = (nameEn, nameVi, next) => {
        nameEn = nameEn.trim().replace(/ +/g, ' ').toLowerCase();
        nameVi = nameVi.trim().replace(/ +/g, ' ').toLowerCase();
        if (categoryMaps[nameEn]) {
            return next(null, categoryMaps[nameEn]);
        }
        const slug = nameEn.replace(/[. \/]+/g, ' ').trim().replace(/ /g, '-');
        Category.findOrCreate({where: {slug}}, {nameEn, nameVi, slug}, (err, category) => {
            if (err) {
                return next(err);
            }
            categoryMaps[nameEn] = category;
            next(null, category);
        });
    };

    const createTag = (nameEn, nameVi, category, next) => {
        nameEn = nameEn.trim().replace(/ +/g, ' ').toLowerCase();
        nameVi = nameVi.trim().replace(/ +/g, ' ').toLowerCase();
        if (tagMaps[nameEn]) {
            return mapCategoryTag(category, tagMaps[nameEn], next);
        }
        const slug = nameEn.replace(/[. \/]+/g, ' ').trim().replace(/ /g, '-');
        Tag.findOrCreate({where: {slug}}, {nameEn, nameVi, slug}, (err, tag) => {
            if (err) {
                return next(err);
            }
            tagMaps[nameEn] = tag;
            mapCategoryTag(category, tag, next);
        });
    };

    const mapCategoryTag = (category, tag, next) => {
        const data = {categoryId: category.id, tagId: tag.id};
        CategoryTag.findOrCreate({where: data}, data, (err) => {
            if (err) {
                return next(err);
            }
            next();
        });
    };

    const parser = parse({delimiter: ','}, (err, data) => {
        async.eachOfSeries(data, (line, index, next) => {
            if (index < 1 || line[0].trim().length === 0) {
                return next();
            }

            findOrCreateCategory(line[0], line[1], (_err, category) => {
                if (_err) {
                    return next(_err);
                }
                createTag(line[2], line[3], category, next);
            });
            // do something with the line
            // doSomething(line).then(function() {
            //     // when processing finishes invoke the callback to move to the next one
            //     callback();
            // });
            // console.log(line);
            // console.log('\n');
            // next();
        }, callback);
    });

    // console.log(FILE_PATH);
    fs.createReadStream(FILE_PATH).pipe(parser);
};

module.exports = migration;
