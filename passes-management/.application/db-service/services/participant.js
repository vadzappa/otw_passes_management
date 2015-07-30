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
                deferred.resolve([]);
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
                deferred.resolve({});
            } else {
                deferred.resolve(person);
            }
        });
        return deferred.promise();
    },
    save: function save(participant) {
        var deferred = new _.Deferred();
        Participant.findById(participant._id, function (err, result) {
            if (!result) {
                new Participant(participant).save(function (error) {
                    deferred.resolve();
                });
            } else {
                _.extend(result, _.omit(participant, '_id'));
                result.save(function (error) {
                    deferred.resolve();
                });
            }
        });
        return deferred.promise();
    }
};

module.exports = ParticipantService;