/**
 * Author: Vadim
 * Date: 7/30/2015
 */

var _ = require('lodash');

var VocabularyManagementFeature = {
    listPassesTypes: function listPassesTypes(request, reply) {
        var passesTypes = _.map(['Full', 'Party', 'Saturday', 'Sunday'], function (value, index) {
            return {
                id: index + 1,
                value: value
            };
        });
        return reply(passesTypes);
    },
    listGenders: function listGenders(request, reply) {
        var sexTypes = _.map(['M', 'F'], function (value, index) {
            return {
                id: index + 1,
                value: value
            };
        });
        return reply(sexTypes);
    },
    listStatusesTypes: function listStatusesTypes(request, reply) {
        var statusesTypes = _.map(['PAID', 'USED', 'UNPAID'], function (value, index) {
            return {
                id: index + 1,
                value: value
            };
        });
        return reply(statusesTypes);
    }
};

module.exports = VocabularyManagementFeature;