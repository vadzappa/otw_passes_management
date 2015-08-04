var fs = require('fs');
var template = fs.readFileSync(__filename.replace(/\.js/, '.html'), 'utf-8');
var $ = require('jquery');

var controller = {
    controller_name: 'RegistrantsListCtrl',
    services: ['$scope', '$http'],
    route: '/',
    template: function () {
        return template;
    },
    controller: function ($scope, $http) {
        $http.get('/people/').success(function (data) {
            $scope.people = data;
        });
        $scope.orderProp = 'surname';
        $scope.sendTicket = function sendTicket($event) {
            var $target = $($event.target),
                $targetLink = $($event.target).closest('a');
            $http.get($targetLink.attr('href'))
                .success(function (data) {
                    $target.addClass('success');
                })
                .error(function (data, status, headers, config) {
                    $target.addClass('error');
                });

            $event.preventDefault();
            $event.stopPropagation();
        };
    }
};

module.exports = controller;