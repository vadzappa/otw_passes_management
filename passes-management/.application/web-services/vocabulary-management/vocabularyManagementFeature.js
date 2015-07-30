/**
 * Author: Vadim
 * Date: 7/30/2015
 */

var _ = require('lodash'),
    VocabularyService = require('../../db-service/services/vocabulary');

_.mixin(require('underscore.deferred'));

var VocabularyManagementFeature = {
    listPassesTypes: function listPassesTypes(request, reply) {
        _.when(VocabularyService.byType('passType'))
            .done(reply);
    },
    listGenders: function listGenders(request, reply) {
        _.when(VocabularyService.byType('gender'))
            .done(reply);
    },
    listStatusesTypes: function listStatusesTypes(request, reply) {
        _.when(VocabularyService.byType('status'))
            .done(reply);
    }
};

module.exports = VocabularyManagementFeature;