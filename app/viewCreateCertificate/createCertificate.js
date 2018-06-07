'use strict';

angular.module('anath.viewCreateCertificate', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Create', {
            templateUrl: 'viewCreateCertificate/viewCreateCertificate.html',
            controller: 'ViewCreateCertificateCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCreateCertificateCtrl', function (CreateService, CertificatesService, $location, csrService, UserService, parseCert) {
        var ctrl = this;

        ctrl.showConfirm = false;
        ctrl.newCert = {};

        UserService(function (user) {
            ctrl.newCert.email = user.user;
            ctrl.newCert.firstname = user.firstname;
            ctrl.newCert.lastname = user.lastname;
        });
        
        CreateService.uses.get({}, function (uses) {
            ctrl.uses = uses.content;
        });

        CertificatesService.ca(function (ca) {
            /*var caPEM = "";
            angular.forEach(ca, function (entry) {
                caPEM += entry;
            });*/
            var caSubject = parseCert(ca.data);

            ctrl.newCert.c = caSubject.C;
            ctrl.newCert.l = caSubject.L;
            ctrl.newCert.o = caSubject.O;
            ctrl.newCert.s = caSubject.S;
            ctrl.newCert.ou = caSubject.OU;
        });
        
        ctrl.createCSR = function () {
            csrService(ctrl.newCert.c, ctrl.newCert.s, ctrl.newCert.l, ctrl.newCert.o, ctrl.newCert.ou, ctrl.newCert.use.use, ctrl.newCert.email, ctrl.newCert.firstname + " " + ctrl.newCert.lastname, function (csr) {
                CertificatesService.certificates.save({
                    csr: {
                        pem: csr
                    },
                    use: ctrl.newCert.use.use
                }, function (response) {
                    console.log(response);
                    if(response.noLaterThan !== undefined) {
                        ctrl.showConfirm = true;
                    } else {
                        $location.path("/Certificates");
                    }
                })
            }, function (key) {
                localStorage[ctrl.newCert.use.use] = key;
            });
        }

        ctrl.confirm = function () {
            CreateService.confirm.do({ token: ctrl.confirmationToken }, function () {
                $location.path("/Certificates");
            });
        }
    })

    .factory('CreateService', function ($resource, appConfig) {
        return {
            uses: $resource(appConfig.AS_BACKEND_BASE_URL + "uses"),
            confirm: $resource(appConfig.AS_BACKEND_BASE_URL + "certificates/confirm/:token", {
                "token": "@token"
            }, {
                do: {
                    method: "PUT"
                }
            })
        }
    });