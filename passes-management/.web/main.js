/**
 * Author: Vadim
 * Date: 7/29/2015
 */

var angular = require('angular'),
    // don't remove - used by browserify to provide angular routing library
    angularRoute = require('angular-route'),
    _ = require('lodash'),
    $ = require('jquery'),
    views = [
        require('./routes/registrants-list/registrantsList'),
        require('./routes/edit-registrant/editRegistrant')
    ];

var otwRegistrantsApp = angular.module('otwRegistrantsApp', ['ngRoute']);

_.each(views, function (viewDetails) {
    otwRegistrantsApp.controller(viewDetails.controller_name, _.union(viewDetails.services, [viewDetails.controller]));
});

otwRegistrantsApp.config(['$routeProvider',
    function ($routeProvider) {
        _.reduce(views, function ($routeProvider, viewDetails) {
            return $routeProvider
                .when(viewDetails.route, {
                    template: viewDetails.template,
                    controller: viewDetails.controller_name
                });
        }, $routeProvider);

        $routeProvider.
            otherwise({
                redirectTo: '/'
            });
    }]);

$(function () {
    angular.bootstrap(document, ['otwRegistrantsApp']);
});

module.exports = otwRegistrantsApp;