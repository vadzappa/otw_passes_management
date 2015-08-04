/**
 * Author: Vadim
 * Date: 7/29/2015
 */

var _ = require('lodash'),
    Boom = require('boom'),
    CommonManagementFeature = require('../common/managementFeature'),
    ParticipantsService = require('../../db-service/services/participant');

_.mixin(require('underscore.deferred'));

var UserManagementFeature = _.extend({
    savePerson: function savePerson(request, reply) {
        _.when(ParticipantsService.save(request.payload))
            .done(reply)
            .fail(UserManagementFeature.failure(request, reply));
    },
    personDetails: function personDetails(request, reply) {
        _.when(ParticipantsService.byId(request.params.personId))
            .done(reply)
            .fail(UserManagementFeature.failure(request, reply));
    },
    listAllUsers: function listAllUsers(request, reply) {
        _.when(ParticipantsService.findAll())
            .done(reply)
            .fail(UserManagementFeature.failure(request, reply));
    }
}, CommonManagementFeature);

module.exports = UserManagementFeature;