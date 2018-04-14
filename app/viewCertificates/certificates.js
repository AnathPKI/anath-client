'use strict';

angular.module('anath.viewCertificates', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Certificates', {
            templateUrl: 'viewCertificates/viewCertificates.html',
            controller: 'ViewCertificatesCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCertificatesCtrl', function (CertificatesService, $mdDialog, $resource, appConfig, UserService) {
        var ctrl = this;

        ctrl.getCertificates = function () {
            CertificatesService.certificates.get({}, function (response) {
                ctrl.certificates = response.content;
            });
        };
        ctrl.getCertificates();

        ctrl.revokeCert = function (link, ev) {
            if (link.rel === "revoke") {
                var confirm = $mdDialog.confirm()
                    .title('Really revoke this certificate?')
                    .textContent('If you revoke this certificate it is disabled and can not be used anylonger!')
                    .ariaLabel('Revoke confirmation')
                    .targetEvent(ev)
                    .ok('Please do it!')
                    .cancel('No, do NOT revoke!');

                $mdDialog.show(confirm).then(function () {
                    $resource(link.href, {}, {revoke: {method: 'PUT'}}).revoke({reason: "Revoked by user, using the web frontend"}, function () {
                        ctrl.getCertificates();
                    });
                }, function () {

                });
            }
        };

        function concatConfig(key, cert, config) {
            console.log(config);
            CertificatesService.ca.get({}, function (response) {
                var ca = "";
                angular.forEach(response, function (entry) {
                    ca += entry;
                });

                config = config.replace(appConfig.Replace_strings.CA, ca);
                console.log(config);
                config = config.replace(appConfig.Replace_strings.CRT, cert);
                console.log(config);
                config = config.replace(appConfig.Replace_strings.KEY, key);

                console.log(config);
            })
        }

        ctrl.downloadConfig = function (link, ev) {
            $resource(link).get({}, function (response) {
                var cert = response.cert.pem;
                var config = response.config;

                if (localStorage[response.use] === undefined) {
                    var key = appConfig.Replace_strings.KEY;

                    var confirm = $mdDialog.confirm()
                        .title('The key is not available')
                        .textContent('If you want, you can download the config without the key')
                        .ariaLabel('Download config without key')
                        .targetEvent(ev)
                        .ok('Download without key')
                        .cancel('Do not download');

                    $mdDialog.show(confirm).then(function () {
                        var key = localStorage[response.use];
                        concatConfig(key, cert, config);
                    });
                } else {
                    var key = localStorage[response.use];
                    concatConfig(key, cert, config);
                }
            })
        }
    })

    .factory('CertificatesService', function ($resource, appConfig) {
        return {
            certificates: $resource(appConfig.AS_BACKEND_BASE_URL + "/certificates"),
            ca: $resource(appConfig.AS_BACKEND_BASE_URL + "ca")
        }
    });