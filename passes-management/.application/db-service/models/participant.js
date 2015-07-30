/**
 * Created by Vadim on 7/30/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParticipantSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    passType: {type: Schema.Types.ObjectId, ref: 'Vocabulary'},
    gender: {type: Schema.Types.ObjectId, ref: 'Vocabulary'},
    paymentStatus: {type: Schema.Types.ObjectId, ref: 'Vocabulary'}
});


module.exports = mongoose.model('Participant', ParticipantSchema);