'use strict';

angular.module('anath.viewCertificates', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Certificates', {
            templateUrl: 'viewCertificates/viewCertificates.html',
            controller: 'ViewCertificatesCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCertificatesCtrl', function (CertificatesService) {
        var ctrl = this;

        ctrl.getCertificates = function () {
            ctrl.certificates = CertificatesService.certificates.get();
        };
        ctrl.getCertificates();
    })

    .factory('CertificatesService', function ($resource, appConfig) {
        return {
            certificates: $resource(appConfig.AS_BACKEND_BASE_URL + "/certificates")
        }
    });