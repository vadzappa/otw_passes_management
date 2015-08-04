/**
 * Author: Vadim
 * Date: 8/4/2015
 */

var CommonManagementFeature = {
    failure: function failure(request, reply) {
        return function (error) {
            request.server.log(['error'], error);
            reply(error);
        };
    }
};

module.exports = CommonManagementFeature;