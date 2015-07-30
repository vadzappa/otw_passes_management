/**
 * Author: Vadim
 * Date: 7/29/2015
 */

var _ = require('lodash'),
    Boom = require('boom'),
    ParticipantsService = require('../../db-service/services/participant');

_.mixin(require('underscore.deferred'));

var UserManagementFeature = {
    savePerson: function savePerson(request, reply) {
        _.when(ParticipantsService.save(request.payload))
            .done(reply);
    },
    personDetails: function personDetails(request, reply) {
        _.when(ParticipantsService.byId(request.params.personId))
            .done(reply);
    },
    listAllUsers: function listAllUsers(request, reply) {
        _.when(ParticipantsService.findAll())
            .done(reply);
    }
};

module.exports = UserManagementFeature;