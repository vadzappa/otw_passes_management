/**
 * Created by Vadim on 7/30/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VocabularySchema = new Schema({
    type:  String,
    value: String
});

VocabularySchema.statics.findPaidStatus = function findPaidStatus(cb) {
    return this.findOne({type: 'status', value: 'PAID'}).exec(cb);
};

module.exports = mongoose.model('Vocabulary', VocabularySchema);