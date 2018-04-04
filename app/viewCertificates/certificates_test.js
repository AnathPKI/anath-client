'use strict';

describe('anath.viewCertificates module', function () {

    beforeEach(module('anath.viewCertificates'));
    beforeEach(module('ngResource'));
    beforeEach(module('anath'));
    beforeEach(module('ngMaterial'));

    var mockCertificatesResource, $httpBackend;
    //beforeEach(angular.mock.module('anath.viewCertificates'));
    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockCertificatesResource = $injector.get('CertificatesService')
        })
    });

    describe('viewCertificates controller', function () {

        it('should be defined', inject(function ($controller) {
            var view1Ctrl = $controller('ViewCertificatesCtrl');
            expect(view1Ctrl).toBeDefined();
        }));

    });

    describe('getCertificates', function () {
        it('should call certificates', inject(function (CertificatesService, appConfig) {
            $httpBackend.
            $httpBackend.expectGET(appConfig.AS_BACKEND_BASE_URL + "certificates")
                .respond([
                    {
                        "content": [
                            {
                                "links": [
                                    {
                                        "href": "string",
                                        "rel": "string",
                                        "templated": true
                                    }
                                ],
                                "serial": 0,
                                "subject": "string",
                                "use": "string",
                                "valid": true
                            }
                        ],
                        "links": [
                            {
                                "href": "string",
                                "rel": "string",
                                "templated": true
                            }
                        ]
                    }
                ]);

            var result = mockCertificatesResource.certificates.get();
            console.log(result);
        }))
    })
});