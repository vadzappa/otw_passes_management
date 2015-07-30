
var fs = require('fs');
var template = fs.readFileSync(__filename.replace(/\.js/, '.html'), 'utf-8');

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
    }
};

module.exports = controller;