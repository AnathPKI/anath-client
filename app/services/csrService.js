'use strict';

angular.module('anath')
    .factory('csrService', function ($q) {

        return function () {
            var deferred = $q.defer();

            var crypto = org.pkijs.getCrypto();
            var sequence = Promise.resolve();
            var pkcs10_simpl = new org.pkijs.simpl.PKCS10();
            var publicKey, privateKey, hash_algorithm;
            hash_algorithm = "sha-256";

            var signature_algorithm_name, keylength;
            signature_algorithm_name = "RSASSA-PKCS1-V1_5";
            keylength = 4096;

            pkcs10_simpl.version = 0;

            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.6",
                value: new org.pkijs.asn1.PRINTABLESTRING({
                    value: "CH"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.8",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "ZH"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.7",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "Winterthur"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.10",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "DATONUS Switzerland"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.11",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "Kei Anig"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.13",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "Blablablatestdesc"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "1.2.840.113549.1.9.1",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "admin@datonus.ch"
                })
            }));
            pkcs10_simpl.subject.types_and_values.push(new org.pkijs.simpl.ATTR_TYPE_AND_VALUE({
                type: "2.5.4.3",
                value: new org.pkijs.asn1.UTF8STRING({
                    value: "vpn01.datonus.ch"
                })
            }));
            pkcs10_simpl.attributes = [];

            sequence = sequence.then(function () {
                var algorithm = org.pkijs.getAlgorithmParameters(signature_algorithm_name, "generatekey");
                algorithm.algorithm.hash.name = hash_algorithm;

                algorithm.algorithm.modulusLength = keylength;

                return crypto.generateKey(algorithm.algorithm, true, algorithm.usages);
            });

            sequence = sequence.then(function (keyPair) {
                publicKey = keyPair.publicKey;
                privateKey = keyPair.privateKey;
            }, function(error) {
                console.log(error);
            });

            sequence = sequence.then(function () {
                return pkcs10_simpl.subjectPublicKeyInfo.importKey(publicKey);
            });

            sequence = sequence.then(function (result) {
                return crypto.digest({
                    name: "SHA-1"
                }, pkcs10_simpl.subjectPublicKeyInfo.subjectPublicKey.value_block.value_hex);
            }).then(function (result) {
                pkcs10_simpl.attributes.push(new org.pkijs.simpl.ATTRIBUTE({
                    type: "1.2.840.113549.1.9.14",
                    values: [(new org.pkijs.simpl.EXTENSION({
                        extensions_array: [
                            new org.pkijs.simpl.EXTENSION({
                                extnID: "2.5.29.14",
                                critical: false,
                                extnValue: (new org.pkijs.asn1.OCTETSTRING({
                                    value_hex: result
                                })).toBER(false)
                            })
                        ]
                    })).toSchema()]
                }));
            });

            sequence = sequence.then(function () {
                return pkcs10_simpl.sign(privateKey, hash_algorithm);
            });

            sequence.then(function () {
                var pkcs10_schema = pkcs10_simpl.toSchema();
                var pkcs10_encoded = pkcs10_schema.toBER(false);

                var result_string = "-----BEGIN CERTIFICATE REQUEST-----\r\n";
                result_string = result_string + formatPEM(window.btoa(arrayBufferToString(pkcs10_encoded)));
                result_string = result_string + "\r\n-----END CERTIFICATE REQUEST-----\r\n";
                console.log(result_string);
            });

            sequence = sequence.then(function () {
                return crypto.exportKey("pkcs8", privateKey);
            });

            sequence.then(function (result) {
                var private_key_string = String.fromCharCode.apply(null, new Uint8Array(result));
                var result_string = "\r\n-----BEGIN PRIVATE KEY-----\r\n";
                result_string = result_string + formatPEM(window.btoa(private_key_string));
                result_string = result_string + "\r\n-----END PRIVATE KEY-----";
                console.log(result_string);
            });

            return deferred.promise;
        }

        function formatPEM(pem_string) {
            var string_length = pem_string.length;
            var result_string = "";

            for (var i = 0, count = 0; i < string_length; i++, count ++) {
                if (count > 63) {
                    result_string = result_string + "\r\n";
                    count = 0;
                }

                result_string = result_string + pem_string[i];
            }

            return result_string;
        }

        function arrayBufferToString(buffer) {
            var result_string = "";
            var view = new Uint8Array(buffer);

            for(var i = 0; i< view.length; i++) {
                result_string = result_string + String.fromCharCode(view[i]);
            }

            return result_string;
        }

    });