/**
 * Author: Vadim
 * Date: 7/30/2015
 */

var fs = require('fs');
var template = fs.readFileSync(__filename.replace(/\.js/, '.html'), 'utf-8');

var controller = {
    controller_name: 'EditRegistrantCtrl',
    services: ['$scope', '$http', '$routeParams', '$location', '$q'],
    route: '/edit/:personId',
    template: function () {
        return template;
    },
    controller: function ($scope, $http, $routeParams, $location, $q) {
        $q.all([
            $http.get('/passTypes/'),
            $http.get('/genders/'),
            $http.get('/statusesTypes/')
        ]).then(function (results) {
            $scope.passTypes = results[0].data;
            $scope.genders = results[1].data;
            $scope.statuses = results[2].data;
            $http.get('/people/' + $routeParams.personId + '/')
                .success(function (data) {
                    $scope.person = data;
                    if (!$scope.person.passType) {
                        $scope.person.passType = $scope.passTypes[0]._id;
                    }
                    if (!$scope.person.gender) {
                        $scope.person.gender = $scope.genders[0]._id;
                    }
                    if (!$scope.person.paymentStatus) {
                        $scope.person.paymentStatus = $scope.statuses[0]._id;
                    }
                }).
                error(function (data, status, headers, config) {
                    $scope.person = {};
                })
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