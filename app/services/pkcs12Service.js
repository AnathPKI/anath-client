'use strict';

angular.module('anath')

    /** Service to create a PKCS#12 encoded export **/
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

        /** Decode base64 **/
        function fromBase64(input) {
            var base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var useUrlTemplate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var cutTailZeros = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var template = useUrlTemplate ? base64UrlTemplate : base64Template;

            //region Aux functions
            function indexof(toSearch) {
                for (var _i2 = 0; _i2 < 64; _i2++) {
                    if (template.charAt(_i2) === toSearch) return _i2;
                }

                return 64;
            }

            function test(incoming) {
                return incoming === 64 ? 0x00 : incoming;
            }

            //endregion

            var i = 0;

            var output = "";

            while (i < input.length) {
                var enc1 = indexof(input.charAt(i++));
                var enc2 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
                var enc3 = i >= input.length ? 0x00 : indexof(input.charAt(i++));
                var enc4 = i >= input.length ? 0x00 : indexof(input.charAt(i++));

                var chr1 = test(enc1) << 2 | test(enc2) >> 4;
                var chr2 = (test(enc2) & 0x0F) << 4 | test(enc3) >> 2;
                var chr3 = (test(enc3) & 0x03) << 6 | test(enc4);

                output += String.fromCharCode(chr1);

                if (enc3 !== 64) output += String.fromCharCode(chr2);

                if (enc4 !== 64) output += String.fromCharCode(chr3);
            }

            if (cutTailZeros) {
                var outputLength = output.length;
                var nonZeroStart = -1;

                for (var _i3 = outputLength - 1; _i3 >= 0; _i3--) {
                    if (output.charCodeAt(_i3) !== 0) {
                        nonZeroStart = _i3;
                        break;
                    }
                }

                if (nonZeroStart !== -1) output = output.slice(0, nonZeroStart + 1);
            }

            return output;
        }

        return function (certPEM, keyPEM, password) {
            var sequence = Promise.resolve();

            /** Begin: Decode PEM and create p8 and cert objects **/
            const keyLocalIDBuffer = new ArrayBuffer(4);
            const keyLocalIDView = new Uint8Array(keyLocalIDBuffer);

            org.pkijs.getRandomValues(keyLocalIDView);

            const certLocalIDBuffer = new ArrayBuffer(4);
            const certLocalIDView = new Uint8Array(certLocalIDBuffer);

            org.pkijs.getRandomValues(certLocalIDView);

            certPEM = certPEM.replace(/(-----(BEGIN|END) CERTIFICATE-----|\n|\s|\r|\[object Object\]true)/g, '');
            var cert = fromBase64(certPEM);
            var certBuffer = stringToArrayBuffer(cert);

            keyPEM = keyPEM.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\n|\s|\r|\[object Object\]true)/g, '');
            var key = fromBase64(keyPEM);
            var keyBuffer = stringToArrayBuffer(key);

            var asn1Cert = org.pkijs.fromBER(certBuffer);
            var certSimpl = new org.pkijs.simpl.CERT({schema: asn1Cert.result});

            var asn1Key = org.pkijs.fromBER(keyBuffer);
            var pkcs8Simpl = new org.pkijs.simpl.PKCS8({schema: asn1Key.result});
            /** End decode **/

            const bitArray = new ArrayBuffer(1);
            const bitView = new Uint8Array(bitArray);

            bitView[0] = bitView[0] | 0x80;

            var keyUsage = new org.pkijs.asn1.BITSTRING({
                valueHex: bitArray,
                unusedBits: 7
            });

            var passwordConverted = stringToArrayBuffer(password);

            pkcs8Simpl.attribute = [
                new org.pkijs.simpl.ATTRIBUTE({
                    type: "2.5.29.15",
                    values: [
                        keyUsage
                    ]
                })
            ];

            /** Create p12 from certSimpl and pkcs8Simpl **/
            var pkcs12 = new org.pkijs.simpl.PFX({
                parsedValue: {
                    integrityMode: 0,
                    authenticatedSafe: new org.pkijs.simpl.pkcs12.AuthenticatedSafe({
                        parsedValue: {
                            safeContents: [{
                                privacyMode: 0,
                                value: new org.pkijs.simpl.pkcs12.SafeContents({
                                    safeBags: [new org.pkijs.simpl.pkcs12.SafeBag({
                                        bagId: "1.2.840.113549.1.12.10.1.2",
                                        bagValue: new org.pkijs.simpl.pkcs12.PKCS8ShroudedKeyBag({
                                            parsedValue: pkcs8Simpl
                                        }),
                                        bagAttributes: [new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.2.840.113549.1.9.20",
                                            values: [new org.pkijs.asn1.BMPSTRING({value: "PKCS8ShroudedKeyBag from PKIjs"})]
                                        }), new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.2.840.113549.1.9.21",
                                            values: [new org.pkijs.asn1.OCTETSTRING({valueHex: keyLocalIDBuffer})]
                                        }), new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.3.6.1.4.1.311.17.1",
                                            values: [new org.pkijs.asn1.BMPSTRING({value: "http://www.pkijs.org"})]
                                        })]
                                    })]
                                })
                            }, {
                                privacyMode: 1,
                                value: new org.pkijs.simpl.pkcs12.SafeContents({
                                    safeBags: [new org.pkijs.simpl.pkcs12.SafeBag({
                                        bagId: "1.2.840.113549.1.12.10.1.3",
                                        bagValue: new org.pkijs.simpl.pkcs12.CertBag({
                                            parsedValue: certSimpl
                                        }),
                                        bagAttributes: [new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.2.840.113549.1.9.20",
                                            values: [new org.pkijs.asn1.BMPSTRING({value: "CertBag from PKIjs"})]
                                        }), new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.2.840.113549.1.9.21",
                                            values: [new org.pkijs.asn1.OCTETSTRING({valueHex: certLocalIDBuffer})]
                                        }), new org.pkijs.simpl.ATTRIBUTE({
                                            type: "1.3.6.1.4.1.311.17.1",
                                            values: [new org.pkijs.asn1.BMPSTRING({value: "http://www.pkijs.org"})]
                                        })]
                                    })]
                                })
                            }]
                        }
                    })
                }
            });

            sequence = sequence.then(function () {
                return pkcs12.parsedValue.authenticatedSafe.parsedValue.safeContents[0].value.safeBags[0].bagValue.makeInternalValues({
                    password: passwordConverted,
                    contentEncryptionAlgorithm: {
                        name: "AES-CBC",
                        length: 128
                    },
                    hmacHashAlgorithm: "SHA-1",
                    iterationCount: 100000
                })

            });

            /** Begin: Encrypt private key **/
            sequence = sequence.then(function () {
                return pkcs12.parsedValue.authenticatedSafe.makeInternalValues({
                    safeContents: [{}, {
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
            /** End encryption section **/

            /** Create blob and call download method **/
            sequence = sequence.then(function () {
                var p12Schema = pkcs12.toSchema();
                var p12BER = p12Schema.toBER(false);
                var p12Uint = new Uint8Array(p12BER);
                var blob = new Blob([p12BER], {type: 'application/x-pkcs12'});
                DownloadService.downloadBlob(blob, "cert-export.p12");
            });

            return sequence;
        }
    })
;