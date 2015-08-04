/**
 * Author: Vadim
 * Date: 7/30/2015
 */

var _ = require('lodash'),
    CommonManagementFeature = require('../common/managementFeature'),
    VocabularyService = require('../../db-service/services/vocabulary');

_.mixin(require('underscore.deferred'));

var VocabularyManagementFeature = _.extend({
    listPassesTypes: function listPassesTypes(request, reply) {
        _.when(VocabularyService.byType('passType'))
            .done(reply)
            .fail(VocabularyManagementFeature.failure(request, reply));
    },
    listGenders: function listGenders(request, reply) {
        _.when(VocabularyService.byType('gender'))
            .done(reply)
            .fail(VocabularyManagementFeature.failure(request, reply));
    },
    listStatusesTypes: function listStatusesTypes(request, reply) {
        _.when(VocabularyService.byType('status'))
            .done(reply)
            .fail(VocabularyManagementFeature.failure(request, reply));
    }
}, CommonManagementFeature);

module.exports = VocabularyManagementFeature;