/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash'),
    SystemUser = require('../models/systemUser');

_.mixin(require('underscore.deferred'));

var SystemUserService = {
    findByLoginAndPassword: function findByLoginAndPassword(payload) {
        var deferred = new _.Deferred();
        SystemUser
            .findByPayload(payload, function (error, user) {
                if (error || !user) {
                    deferred.reject(error || 'User not found');
                } else {
                    deferred.resolve(user.toObject({getters: true, virtuals: false, versionKey: false}));
                }
            });
        return deferred.promise();
    }
};

module.exports = SystemUserService;