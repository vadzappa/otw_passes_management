/**
 * Author: Vadim
 * Date: 7/30/2015
 */

var fs = require('fs');
var template = fs.readFileSync(__filename.replace(/\.js/, '.html'), 'utf-8');

var controller = {
    controller_name: 'EditRegistrantCtrl',
    services: ['$scope', '$http', '$routeParams', '$location'],
    route: '/edit/:personId',
    template: function () {
        return template;
    },
    controller: function ($scope, $http, $routeParams, $location) {
        $http.get('/people/' + $routeParams.personId + '/')
            .success(function (data) {
                $scope.person = data;
            }).
            error(function (data, status, headers, config) {
                $scope.person = {};
            });
        $http.get('/passTypes/').success(function (data) {
            $scope.passTypes = data;
        });
        $http.get('/genders/').success(function (data) {
            $scope.genders = data;
        });
        $http.get('/statusesTypes/').success(function (data) {
            $scope.statuses = data;
        });

        $scope.saveUser = function () {
            $http.post('/people/' + $routeParams.personId + '/', $scope.person)
                .success(function (data) {
                    // SAVED
                    $location.path('/');
                })
                .error(function (data, status, headers, config) {
                    // ERROR
                });
        };
    }
};

module.exports = controller;