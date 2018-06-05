'use strict';

angular.module('anath.viewCertificates', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Certificates', {
            templateUrl: 'viewCertificates/viewCertificates.html',
            controller: 'ViewCertificatesCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewCertificatesCtrl', function (CertificatesService, $mdDialog, $resource, appConfig, UserService, DownloadService, pkcs12Service) {
        var ctrl = this;

        ctrl.getCertificates = function () {
            CertificatesService.certificates.get({}, function (response) {
                ctrl.certificates = response.content;
            });
        };
        ctrl.getCertificates();

        ctrl.extractMail = function (text) {
            return text.replace(/^.*E=/, '').replace(/\+CN=.*$/, '');
        };

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

            console.log(key);
            config = config.replace(appConfig.Replace_strings.CRT, cert);
            config = config.replace(appConfig.Replace_strings.KEY, key);
            config = config.replace(/\n/g, '\r\n');

            DownloadService.downloadTextFile(config, "testfile.conf");
        }

        ctrl.downloadConfig = function (link, ev) {
            CertificatesService.singleCertificate(link, function (response) {
                var cert = response.cert.pem.replace(/\[object Object\]true/g, '');
                var config = atob(response.config);
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
                        concatConfig(key, cert, config);
                    }, function () {

                    });
                } else {
                    var privKey = localStorage[response.use];
                    concatConfig(privKey, cert, config);
                }
            })
        };

        ctrl.exportP12 = function (link, event) {
            CertificatesService.singleCertificate(link, function (response) {
                if (localStorage[response.use] === undefined) {

                    $mdDialog.show(
                        $mdDialog.alert()
                            .title('The key is not available')
                            .textContent('The private key for this certificate is not available. An export is not possible.')
                            .ariaLabel('Export not possible')
                            .ok('OK')
                            .targetEvent(event)
                    );
                } else {
                    var confirm = $mdDialog.prompt()
                        .title('What would you name your dog?')
                        .textContent('This export contains your private key. So please choose a password and be careful with the downloaded file!')
                        .placeholder('Password')
                        .ariaLabel('PKCS12 Password')
                        .initialValue('')
                        .targetEvent(event)
                        .required(true)
                        .ok('Okay!')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function (password) {
                        var privateKey = localStorage[response.use];
                        pkcs12Service(response.cert.pem, privateKey, password);
                    }, function () {
                    });

                }
            });
        }
    })

    .factory('CertificatesService', function ($resource, appConfig, $http) {
        return {
            certificates: $resource(appConfig.AS_BACKEND_BASE_URL + "certificates"),
            ca: function (callback, errorCallBack) {
                $http(
                    {
                        url: appConfig.AS_BACKEND_BASE_URL + "ca.pem",
                        method: 'GET',
                        transformResponse: [function (data) {
                            return data;
                        }]
                    }).then(callback, errorCallBack);
            },
            singleCertificate: function (link, callBack) {
                $resource(link, {}, {
                    get: {
                        method: 'GET',
                        headers: {
                            "Accept": appConfig.ContentType
                        }
                    }
                }).get({}, callBack);
            }
        }
    })
;