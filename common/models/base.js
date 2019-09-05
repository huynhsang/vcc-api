module.exports = function (Base) {
    /**
     *
     * The method is responsible for handling logic before saving Object
     */
    Base.observe('before save', function (ctx, next) {
        if (!ctx.isNewInstance) {
            const data = ctx.instance ? ctx.instance : ctx.data;
            if (ctx.options.accessToken) {
                data.updatedBy = ctx.options.accessToken.userId;
            }
            delete data.createdBy;
        }
        next();
    });
};
