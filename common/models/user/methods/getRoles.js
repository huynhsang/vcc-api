export default (User) => {
    User.prototype.getRoles = function (callback) {
        this.roles((err, roles) => {
            if (err) {
                return callback(err);
            }
            callback(null, roles.map((r) => r.name));
        });
    };
}