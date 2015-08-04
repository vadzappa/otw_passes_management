/**
 * Created by Vadim on 7/30/2015.
 */

var _ = require('lodash'),
    Participant = require('../models/participant');

_.mixin(require('underscore.deferred'));

var ParticipantService = {
    findAll: function findAll() {
        var deferred = new _.Deferred();
        Participant.find(function (error, personsList) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(personsList);
            }
        }).
            populate('passType gender paymentStatus');
        return deferred.promise();
    },
    byId: function byId(id) {
        var deferred = new _.Deferred();
        Participant.findById(id, function (error, person) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(person);
            }
        });
        return deferred.promise();
    },
    byTicket: function byTicket(ticketNumber) {
        var deferred = new _.Deferred();
        Participant.findOne({ticketNumber: ticketNumber}).populate('paymentStatus').exec(function (error, person) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(person);
            }
        });
        return deferred.promise();
    },
    useTicket: function useTicket(participant) {
        var deferred = new _.Deferred();
        participant.ticketUsed(function (error) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(participant);
            }
        });
        return deferred.promise();
    },
    save: function save(participant) {
        var deferred = new _.Deferred();
        Participant.findById(participant._id, function (err, result) {
            if (!result) {
                new Participant(participant).save(function (error) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve();
                    }

                });
            } else {
                _.extend(result, _.omit(participant, '_id'));
                result.save(function (error) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve();
                    }
                });
            }
        });
        return deferred.promise();
    }
};

module.exports = ParticipantService;