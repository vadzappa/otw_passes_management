/**
 * Created by Vadim on 8/5/2015.
 */


var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    systemUsersService = require('../../db-service/services/users'),
    loginFileLocation = '../../../static/login.html',
    CommonManagementFeature = require('../common/managementFeature');

_.mixin(require('underscore.deferred'));

var LoginManagementFeature = _.extend({
    userLogin: function userLogin(request, reply) {
        _.when(systemUsersService.findByLoginAndPassword(request.payload))
            .done(function (user) {
                request.session.set('user', user);

                var redirectAfterLogin = undefined;

                var requestedPath = request.session.flash('requested-path');
                if (requestedPath && requestedPath.length > 0) {
                    if (_.isArray(requestedPath)) {
                        redirectAfterLogin = _.first(requestedPath);
                    } else {
                        redirectAfterLogin = requestedPath;
                    }
                }

                if (redirectAfterLogin) {
                    reply().redirect(redirectAfterLogin);
                } else {
                    reply().redirect('/');
                }

            })
            .fail(function (error) {
                request.server.log(['error'], error);
                reply(fs.createReadStream(path.join(__dirname, loginFileLocation)));
            });
    }
}, CommonManagementFeature);

module.exports = LoginManagementFeature;