/**
 * Created by Vadim on 7/30/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    maxTicketUsage = 10 * 60 * 1000,
    VocabularySchema = require('./vocabulary'),
    TicketUsageError = require('../../utils/error/ticketUsageError');

var ParticipantSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    ticketNumber: String,
    ticketUsedTimestamp: Date,
    amount: Number,
    passType: {type: Schema.Types.ObjectId, ref: 'Vocabulary'},
    gender: {type: Schema.Types.ObjectId, ref: 'Vocabulary'},
    paymentStatus: {type: Schema.Types.ObjectId, ref: 'Vocabulary'}
});

ParticipantSchema.methods.ticketUsed = function (cb) {
    var currentTime = new Date(),
        self = this;
    if (self.paymentStatus.value.toLowerCase() !== 'paid') {
        cb(new TicketUsageError('Ticket not paid!', 1));
    } else if (!this.ticketUsedTimestamp) {
        this.ticketUsedTimestamp = currentTime;
        VocabularySchema.findPaidStatus(function (error, status) {
            if (!error && status) {
                self.paymentStatus = status;
            }
            self.save(function (error) {
                cb(error || new TicketUsageError('Ticket is FINE', 3));
            });
        });
    } else if (currentTime - this.ticketUsedTimestamp > maxTicketUsage) {
        cb(new TicketUsageError('Ticket has been used already!', 2));
    } else {
        cb(new TicketUsageError('Ticket is FINE', 3));
    }

};

ParticipantSchema.pre('save', function (next) {
    if (!this.ticketNumber) {
        this.ticketNumber = new Date().getTime().toString().substr(5);
    }
    next();
});

module.exports = mongoose.model('Participant', ParticipantSchema);