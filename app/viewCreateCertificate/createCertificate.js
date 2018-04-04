'use strict';

angular.module('anath.viewCreateCertificate', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Create', {
            templateUrl: 'viewCreateCertificate/viewCreateCertificate.html',
            controller: 'ViewCreateCertificateCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCreateCertificateCtrl', function (CreateService) {
        var ctrl = this;

        /*ctrl.getCertificates = function () {
            ctrl.certificates = CertificatesService.certificates.get();
        };
        ctrl.getCertificates();*/
    })

    .factory('CreateService', function ($resource, appConfig) {
        return {
            sign: $resource(appConfig.AS_BACKEND_BASE_URL + "/sign")
        }
    });