/**
 * Author: Vadim
 * Date: 8/3/2015
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SystemRoleSchema = new Schema({
    roleName: String,
    allowedPaths: [String]
});


module.exports = mongoose.model('SystemRole', SystemRoleSchema);