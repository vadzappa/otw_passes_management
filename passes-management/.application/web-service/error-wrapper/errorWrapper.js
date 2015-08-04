/**
 * Author: Vadim
 * Date: 8/4/2015
 */

var fs = require('fs'),
    path = require('path'),
    errorTemplate = fs.readFileSync(path.join(__dirname, 'error.html')).toString();

var ErrorWrapperFeature = {
    wrapError: function wrapError(request, reply) {
        var response = request.response;
        if (response.isBoom && response.ticketUsageErrorCode) {

            return reply(errorTemplate
                .replace(/\$errorType/ig, response.ticketUsageErrorCode)
                .replace(/\$errorText/ig, response.message));
        }

        return reply.continue();
    }
};

module.exports = ErrorWrapperFeature;