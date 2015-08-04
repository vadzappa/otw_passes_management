/**
 * Author: Vadim
 * Date: 8/4/2015
 */


var LoggingFeature = {
    bindToServer: function bindToServer(server) {
        server.on('log', function () {
            console.log(Array.prototype.slice.apply(arguments));
        });
    }
};

module.exports = LoggingFeature;