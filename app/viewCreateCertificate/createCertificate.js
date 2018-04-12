'use strict';

angular.module('anath.viewCreateCertificate', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Create', {
            templateUrl: 'viewCreateCertificate/viewCreateCertificate.html',
            controller: 'ViewCreateCertificateCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCreateCertificateCtrl', function (CreateService, $location, csrService, UserService, parseCert) {
        var ctrl = this;

        ctrl.newCert = {};

        UserService(function (user) {
            ctrl.newCert.email = user.user;
            ctrl.newCert.firstname = user.firstname;
            ctrl.newCert.lastname = user.lastname;
        });
        
        CreateService.uses.get({}, function (uses) {
            ctrl.uses = uses.content;
        });

        CreateService.ca.get({}, function (ca) {
            var caPEM = "";
            angular.forEach(ca, function (entry) {
                caPEM += entry;
            });
            var caSubject = parseCert(caPEM);
            console.log(caSubject);

            ctrl.newCert.c = caSubject.C;
            ctrl.newCert.l = caSubject.L;
            ctrl.newCert.o = caSubject.O;
            ctrl.newCert.s = caSubject.S
        });
        
        ctrl.createCSR = function () {
            csrService(ctrl.newCert.c, ctrl.newCert.s, ctrl.newCert.l, ctrl.newCert.o, "", ctrl.newCert.use.use, ctrl.newCert.email, ctrl.newCert.firstname + " " + ctrl.newCert.lastname, function (csr) {
                console.log(csr);
                CreateService.sign.save({
                    csr: {
                        pem: csr
                    },
                    use: ctrl.newCert.use.use
                }, function () {
                    //$location.href("/Download");
                })
            }, function (key) {
                console.log(key);
            });
            /**/
        }
    })

    .factory('CreateService', function ($resource, appConfig) {
        return {
            sign: $resource(appConfig.AS_BACKEND_BASE_URL + "sign"),
            uses: $resource(appConfig.AS_BACKEND_BASE_URL + "uses"),
            ca: $resource(appConfig.AS_BACKEND_BASE_URL + "ca")
        }
    });