'use strict';

angular.module('anath.viewLogin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Login', {
            templateUrl: 'viewLogin/viewLogin.html',
            controller: 'ViewLoginCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewLoginCtrl', function (AuthenticationService, $window) {
        var ctrl = this;

        ctrl.login = function () {
            AuthenticationService.login(ctrl.username, ctrl.password, function (success) {
                if(success) {
                    $window.location.href = "/";
                } else {
                    ctrl.error = true;
                }
            })
        }
    });