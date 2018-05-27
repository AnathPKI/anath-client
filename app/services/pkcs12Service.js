'use strict';

angular.module('anath')
    .factory('pkcs12Service', function (DownloadService) {
        function stringToArrayBuffer(str) {
            /// <summary>Create an ArrayBuffer from string</summary>
            /// <param name="str" type="String">String to create ArrayBuffer from</param>
            var stringLength = str.length;
            var resultBuffer = new ArrayBuffer(stringLength);
            var resultView = new Uint8Array(resultBuffer);
            for (var i = 0; i < stringLength; i++)
                resultView[i] = str.charCodeAt(i);
            return resultBuffer;
        }


        return function (certPEM, keyPEM, password) {
            var sequence = Promise.resolve();

            const keyLocalIDBuffer = new ArrayBuffer(4);
            const keyLocalIDView = new Uint8Array(keyLocalIDBuffer);

            org.pkijs.getRandomValues(keyLocalIDView);

            const certLocalIDBuffer = new ArrayBuffer(4);
            const certLocalIDView = new Uint8Array(certLocalIDBuffer);

            org.pkijs.getRandomValues(certLocalIDView);

            certPEM = certPEM.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n|\s|\r|\[object Object\]true)/g, '');
            var cert = atob(certPEM).toString('binary');
            var certBuffer = stringToArrayBuffer(cert);

            keyPEM = keyPEM.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\n|\s|\r|\[object Object\]true)/g, '');
            var key = atob(keyPEM).toString('binary');
            var keyBuffer = stringToArrayBuffer(key);

            var asn1Cert = org.pkijs.fromBER(certBuffer);
            var certSimpl = new org.pkijs.simpl.CERT({schema: asn1Cert.result});

            var asn1Key = org.pkijs.fromBER(keyBuffer);
            var pkcs8Simpl = new org.pkijs.simpl.PKCS8({schema: asn1Key.result});

            const bitArray = new ArrayBuffer(1);
            const bitView = new Uint8Array(bitArray);

            bitView[0] = bitView[0] | 0x80;

            var keyUsage = new org.pkijs.asn1.BITSTRING({
                valueHex: bitArray,
                unusedBits: 7
            });

            var passwordConverted = stringToArrayBuffer(password);

            pkcs8Simpl.attribute = [
                new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                    type: "2.5.29.15",
                    values: [
                        keyUsage
                    ]
                })
            ];

            var pkcs12 = new org.pkijs.simpl.PFX({
                parsedValue: {
                    integrityMode: 0,
                    authenticatedSafe: new org.pkijs.simpl.pkcs12.AuthenticatedSafe({
                        parsedValue: {
                            safeContents: [
                                {
                                    privacyMode: 0,
                                    value: new org.pkijs.simpl.pkcs12.SafeContents({
                                        safeBags: [
                                            new org.pkijs.simpl.pkcs12.SafeBag({
                                                bagId: "1.2.840.113549.1.12.10.1.2",
                                                bagValue: new org.pkijs.simpl.pkcs12.PKCS8ShroudedKeyBag({
                                                    parsedValue: pkcs8Simpl
                                                }),
                                                bagAttributes: [
                                                    new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                                        type: "1.2.840.113549.1.9.20",
                                                        values: [
                                                            new org.pkijs.asn1.BMPSTRING({
                                                                value: "PKCS8ShroudedKeyBag from PKIjs"
                                                            })
                                                        ]
                                                    }),
                                                    new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                                        type: "1.2.840.113549.1.9.21",
                                                        values: [
                                                            new org.pkijs.asn1.OCTETSTRING({
                                                                valueHex: keyLocalIDBuffer
                                                            })
                                                        ]
                                                    }),
                                                    new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                                        type: "1.3.6.1.4.1.311.17.1",
                                                        values: [
                                                            new org.pkijs.asn1.BMPSTRING({
                                                                value: "http://www.pkijs.org"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                }
                            ]
                        },
                        privacyMode: 1,
                        value: new org.pkijs.simpl.pkcs12.SafeContents({
                            safeBags: [
                                new org.pkijs.simpl.pkcs12.SafeBag({
                                    bagId: "1.2.840.113549.1.12.10.1.3",
                                    bagValue: new org.pkijs.simpl.pkcs12.CertBag({
                                        parsedValue: certSimpl
                                    }),
                                    bagAttributes: [
                                        new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                            type: "1.2.840.113549.1.9.20",
                                            values: [
                                                new org.pkijs.asn1.BMPSTRING({
                                                    value: "CertBag from PKIjs"
                                                })
                                            ]
                                        }),
                                        new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                            type: "1.2.840.113549.1.9.21",
                                            values: [
                                                new org.pkijs.asn1.OCTETSTRING({
                                                    valueHex: certLocalIDBuffer
                                                })
                                            ]
                                        }),
                                        new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                                            type: "1.3.6.1.4.1.311.17.1",
                                            values: [
                                                new org.pkijs.asn1.BMPSTRING({
                                                    value: "http://www.pkijs.org"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                }
            })

            sequence = sequence.then(function () {
                return pkcs12.parsedValue.authenticatedSafe.parsedValue.safeContents[0].value.safeBags[0].bagValue.makeInternalValues({
                    safeContents: [{
                        password: passwordConverted,
                        contentEncryptionAlgorithm: {
                            name: "AES-CBC",
                            length: 128
                        },
                        hmacHashAlgorithm: "SHA-1",
                        iterationCount: 100000
                    }]
                })

            });

            sequence = sequence.then(function () {
                return pkcs12.parsedValue.authenticatedSafe.makeInternalValues({
                    safeContents: [{
                        password: passwordConverted,
                        contentEncryptionAlgorithm: {
                            name: "AES-CBC",
                            length: 128
                        },
                        hmacHashAlgorithm: "SHA-1",
                        iterationCount: 100000
                    }]
                })

            });

            sequence = sequence.then(function () {
                return pkcs12.makeInternalValues({
                    password: passwordConverted,
                    iterations: 100000,
                    pbkdf2HashAlgorithm: "SHA-256",
                    hmacHashAlgorithm: "SHA-256"
                })
            });

            sequence = sequence.then(function () {
                var p12Schema = pkcs12.toSchema();
                var p12BER = p12Schema.toBER(false);
                var p12Uint = new Uint8Array(p12BER);
                console.log(p12Uint);
                var blob = new Blob(p12Uint, {type: 'application/x-pkcs12'});
                DownloadService.downloadBlob(blob, "testfile.p12");
            });

            return sequence;
        }
    })
;