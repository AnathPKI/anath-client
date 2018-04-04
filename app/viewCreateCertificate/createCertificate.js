'use strict';

angular.module('anath.viewCreateCertificate', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Create', {
            templateUrl: 'viewCreateCertificate/viewCreateCertificate.html',
            controller: 'ViewCreateCertificateCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCreateCertificateCtrl', function (CreateService, $location) {
        var ctrl = this;

        ctrl.newCert = {};
        
        ctrl.use = CreateService.use.query();
        
        ctrl.createCert = function () {
            CreateService.sign.save(newCert, function () {
                $location.href("/Download");
            })
        }
    })

    .factory('CreateService', function ($resource, appConfig) {
        return {
            sign: $resource(appConfig.AS_BACKEND_BASE_URL + "sign"),
            use: $resource(appConfig.AS_BACKEND_BASE_URL + "use")
        }
    });