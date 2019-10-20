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
