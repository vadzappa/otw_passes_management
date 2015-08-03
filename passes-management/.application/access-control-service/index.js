/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash');


var AccessControlFeature = function (options) {
    var redirectUrl = options['unauthorized-redirect'],
        anonymousPermittedPaths = options.anonymous;

    return {
        checkAccess: function (request, reply) {
            var user = request.session && request.session.get('user'),
                allowedPaths = user ? (user.role && user.role.allowedPaths) || anonymousPermittedPaths : anonymousPermittedPaths;

            var pathAllowed = _.find(allowedPaths, function (allowanceDetails) {

                var allowedMethod = allowanceDetails.indexOf(':') > 0 ? allowanceDetails.split(':')[0] : '.*',
                    allowedPath = allowanceDetails.indexOf(':') > 0 ? allowanceDetails.split(':')[1] : allowanceDetails.split(':')[0];
                var pathRegex = new RegExp(allowedPath),
                    methodRegex = new RegExp(allowedMethod, 'i');
                return pathRegex.test(request.path) && methodRegex.test(request.method);
            });

            return pathAllowed ? reply.continue() : reply().redirect(redirectUrl);

        }
    }
};

module.exports = AccessControlFeature;