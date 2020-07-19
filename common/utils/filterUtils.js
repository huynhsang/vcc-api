const normalizeIncludeFields = (fields) => {
    const output = {};
    if (!fields) {
        return fields;
    }
    if (typeof fields === 'string') {
        output[fields] = true;
    } else if (Array.isArray(fields)) {
        fields.forEach(item => {
            output[item] = true;
        });
    } else {
        for (const key in fields) {
            output[key] = (fields[key] === 'true' || fields[key] === '1');
        }
    }
    return output;
};

export {normalizeIncludeFields};

const getModelProperties = function(Model) {
    const properties = Object.keys(Model.definition.properties);
    const fields = [];
    for (let i = 0, length = properties.length; i < length; i++) {
        if (Model.isProtectedProperty(properties[i]) || Model.isHiddenProperty(properties[i])) {
            continue;
        }
        fields.push(properties[i]);
    }
    return fields;
};

export { getModelProperties };

const getRelationLocalField = function(relation) {
    switch(relation.type) {
        case 'embedsOne':
        case 'embedsMany':
            return relation.keyFrom;
        default:
            return relation.name;
    }
};

export { getRelationLocalField };

const getRelationByFieldName = function(Model, propName) {
    if (!propName || !_.isString(propName)) {
        return null;
    }
    const relations = Model.relations;
    for (const key in relations) {
        const field = getRelationLocalField(relations[key]);
        if (field.toLowerCase() === propName.toLowerCase()) {
            return relations[key];
        }
    }
    return null;
};

export { getRelationByFieldName };