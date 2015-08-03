/**
 * Created by Vadim on 7/30/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    SystemRole = require('./systemRole');

var SystemUserSchema = new Schema({
    username: String,
    passwordHash: String,
    role: {type: Number, ref: 'SystemRole'},
    roleName: String
});

var SystemUserPassword = SystemUserSchema.virtual('password');

SystemUserPassword.set(function (password) {
    this.passwordHash = crypto.createHash('md5').update(password).digest('hex');
});

SystemUserPassword.get(function () {
    return null;
});

SystemUserSchema.pre('save', function (next) {
    var self = this;
    SystemRole.findOne({
        roleName: self.roleName
    }, function (err, result) {
        if (err) {
            next(err);
        } else {
            self.role = result;
            next();
        }
    });
});

SystemUserSchema.statics.findByPayload = function findByPayload(payload, cb) {
    var passwordHash = payload.password ? crypto.createHash('md5').update(payload.password).digest('hex') : '';
    return this.findOne({username: payload.username, passwordHash: passwordHash}).populate('role').exec(cb);
};

module.exports = mongoose.model('SystemUser', SystemUserSchema);