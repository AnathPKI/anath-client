"use strict";

describe('anath certs', function () {
    beforeEach(module('anath'));

    describe('csrService', function () {
        var service;

        beforeEach(inject(function (csrService) {
            service = csrService;
        }));

        it('should be defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should create CSR and private key', inject(function () {
            service('country', 'state', 'city', 'o', 'ou', 'desc', 'mail', 'cn', function (csr) {
                expect(csr).toContain("-----Begin Certificate Request-----");
                expect(csr).toContain("-----END Certificate Request-----");
            }, function(key) {
                expect(key).toContain("-----BEGIN PRIVATE KEY-----");
                expect(key).toContain("-----END PRIVATE KEY-----");
            });
        }))
    });

    describe('parseCert', function () {
        var service;

        beforeEach(inject(function (parseCert) {
            service = parseCert;
        }));

        it('should be defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should extract information from a certificate', inject(function () {
            var certInfo = service('-----BEGIN CERTIFICATE-----\n' +
            'MIIDKDCCApGgAwIBAgIRAL95NRn62Elcg/kAbI4eX1wwDQYJKoZIhvcNAQENBQAw\n' +
            'WjENMAsGA1UEBhMEdGVzdDENMAsGA1UECgwEdGVzdDENMAsGA1UECwwEdGVzdDEN\n' +
            'MAsGA1UEBwwEdGVzdDENMAsGA1UECAwEdGVzdDENMAsGA1UEAwwEdGVzdDAeFw0x\n' +
            'ODA1MDYxMzUwMDVaFw0yODA1MDMxMzUwMDVaMFoxDTALBgNVBAYTBHRlc3QxDTAL\n' +
            'BgNVBAoMBHRlc3QxDTALBgNVBAsMBHRlc3QxDTALBgNVBAcMBHRlc3QxDTALBgNV\n' +
            'BAgMBHRlc3QxDTALBgNVBAMMBHRlc3QwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJ\n' +
            'AoGBAJUYGd5NUtL0iWJvbVKIC8uZQFi3zllV6LJsNn3hvNjK/MiIbfdW/dfD3/Jl\n' +
            'zy4rSrHoUSl2nOc63yR5U2nZr3d+Mu/f0ZdWvPFUJegKb2l6aMLOb72svO+0ybFw\n' +
            '4mlx4yiU57uz/izH1PUDR059V0Q0RZbrMrkv0BvLLdujoj0BAgMBAAGjge0wgeow\n' +
            'DwYDVR0TAQH/BAUwAwEB/zCBlAYDVR0jBIGMMIGJgBSy7eOPpA2Q7aV+/eXJ+K/K\n' +
            'NtbSZ6FepFwwWjENMAsGA1UEBhMEdGVzdDENMAsGA1UECgwEdGVzdDENMAsGA1UE\n' +
            'CwwEdGVzdDENMAsGA1UEBwwEdGVzdDENMAsGA1UECAwEdGVzdDENMAsGA1UEAwwE\n' +
            'dGVzdIIRAL95NRn62Elcg/kAbI4eX1wwHQYDVR0OBBYEFLLt44+kDZDtpX795cn4\n' +
            'r8o21tJnMA4GA1UdDwEB/wQEAwIBRjARBgNVHSAECjAIMAYGBFUdIAAwDQYJKoZI\n' +
            'hvcNAQENBQADgYEAggfMHg8vRJN/GbNByiB2rTTyg0awl05C1vqJvXVqERK+Tqzz\n' +
            'bf35Q8+2zSk4rVPyULNc08G9KvnME76tXjaFLPngXfOVd2h8SPvfgP9jlFUWVgZT\n' +
            'vMRyfSSz+uxRMfcyGq/Opu4+qkfHJVXRseOPGQVZBsZ56LHrVgYXjn3Jwy0=\n' +
            '-----END CERTIFICATE-----');
            expect(certInfo.C).toBe('test');
            expect(certInfo.O).toBe('test');
            expect(certInfo.OU).toBe('test');
            expect(certInfo.L).toBe('test');
            expect(certInfo.S).toBe('test');
            expect(certInfo.CN).toBe('test');
        }));
    })
})