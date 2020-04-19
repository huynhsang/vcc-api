export const getTagOrder = (sort) => {
    switch (sort) {
        case 'recent':
            return ['id DESC'];
        case 'popular':
            return ['questionCount DESC'];
        default:
            return ['id ASC'];
    }
};
