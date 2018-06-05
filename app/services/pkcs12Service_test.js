"use strict";

describe('anath pkcs12', function () {
    beforeEach(module('anath'));

    describe('pkcs12Service', function () {
        var service, download;

        beforeEach(inject(function (pkcs12Service, DownloadService) {
            service = pkcs12Service;
            download = DownloadService;
        }));

        it('should be defined', inject(function () {
            expect(service).toBeDefined();
        }));

        it('should call the download service after creating p12', inject(function () {

            document.body.appendChild = function () {};
            document.body.removeChild = function () {};
            var cert = '-----BEGIN CERTIFICATE-----\n' +
                'MIIEDTCCA3agAwIBAgIRAMnR0buXCkO6v3zbvD0yfA4wDQYJKoZIhvcNAQENBQAw\n' +
                'WjENMAsGA1UEBhMEdGVzdDENMAsGA1UECgwEdGVzdDENMAsGA1UECwwEdGVzdDEN\n' +
                'MAsGA1UEBwwEdGVzdDENMAsGA1UECAwEdGVzdDENMAsGA1UEAwwEdGVzdDAeFw0x\n' +
                'ODA2MDEwNzQ0MjJaFw0xODExMjgwNzQ0MjJaMIGYMQ0wCwYDVQQGEwR0ZXN0MQ0w\n' +
                'CwYDVQQIEwR0ZXN0MQ0wCwYDVQQHEwR0ZXN0MQ0wCwYDVQQKEwR0ZXN0MQ0wCwYD\n' +
                'VQQLDAR0ZXN0MRAwDgYDVQQNEwd0ZXN0VXNlMSAwHgYJKoZIhvcNAQkBExFtYXJ0\n' +
                'aW5Ad2l0dHczci5jaDEXMBUGA1UEAxMOTWFydGluIFdpdHR3ZXIwggIiMA0GCSqG\n' +
                'SIb3DQEBAQUAA4ICDwAwggIKAoICAQCiQSWcL4bEa/Fsy8wAsNdtqMiF9OlBjN1P\n' +
                'PqLzFS3P8JeTxB2g7xiuniIeI+E7YmH/xbmg3Xtl0OnueYyVMPDIwoCsB614E+7V\n' +
                '52ES7rNSsJ4ygd9c4vAJwEfqRVDCsc+S+mu2uSCU+BJ4PI85SJ/iDj2VtdBXXUGO\n' +
                '5gFHhjbJLfUP2faRZlR1V1EPcWRWHuCYPRgEYUGwbu4pT08tg8Q9OpPfgp+zjOjt\n' +
                'QldOc1fg0fc6BIJ/ENgQ1yBZQYIGBTMw6C/j/v7MadTaiyI93X14jqH+CS87itfd\n' +
                'bB6VJ+TYfsoGZ9V+f2lzCmuDegydwiijPQS9575dvwvIJdR+07kWxbhVP+gUcs9Y\n' +
                'YumA+5iHgWATmS9KIHBhggPNYg1osQi47Q8j0JiCmH0580WmODD3dEuAtM7myINx\n' +
                '4hDS9afsENC8rLXW2pTF/yC2l+BcT56nKgw6hXWkHMC67vFXT3w/IhBPAK84yH9b\n' +
                'fNmQt9YIacEdfunVfgMLXtl3kcsXoLOslLEWcAFY4QY7d4DK7PcAtA1vEQ34SQug\n' +
                'qsSxZkAlHi8TkJVM8QBwAdAoDssnMqDIS/ScCNP8k8Fhnz9YCmnENdf6MQAKvLRC\n' +
                'zbNkGhnWSdlgD2G7z1XE35sDvidZPPdRvRnbTzRgM+wibuf4MKpQa/NV5CM+cPZB\n' +
                'BHl+TByMRQIDAQABoxAwDjAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3DQEBDQUAA4GB\n' +
                'AGS0q5eeNRVlWUSPJhGwEEdHFPplcFuL8gi+NS5X0CcWuKT+MlcG7hamvulYOyDQ\n' +
                'VKphFfV+mbVGt2Akt9fnJ9XicU7KJjD7o23wEB/v4qVgJoROjfKcvTux3hWLTEnr\n' +
                'vMVt8dOAGaH7JfwK+Vom4wWWanJbpDiSBJuUjVYyLNRq\n' +
                '-----END CERTIFICATE-----';
            var key = '-----BEGIN PRIVATE KEY-----\n' +
                'MIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICAQCiQSWcL4bEa/Fs\n' +
                'y8wAsNdtqMiF9OlBjN1PPqLzFS3P8JeTxB2g7xiuniIeI+E7YmH/xbmg3Xtl0Onu\n' +
                'eYyVMPDIwoCsB614E+7V52ES7rNSsJ4ygd9c4vAJwEfqRVDCsc+S+mu2uSCU+BJ4\n' +
                'PI85SJ/iDj2VtdBXXUGO5gFHhjbJLfUP2faRZlR1V1EPcWRWHuCYPRgEYUGwbu4p\n' +
                'T08tg8Q9OpPfgp+zjOjtQldOc1fg0fc6BIJ/ENgQ1yBZQYIGBTMw6C/j/v7MadTa\n' +
                'iyI93X14jqH+CS87itfdbB6VJ+TYfsoGZ9V+f2lzCmuDegydwiijPQS9575dvwvI\n' +
                'JdR+07kWxbhVP+gUcs9YYumA+5iHgWATmS9KIHBhggPNYg1osQi47Q8j0JiCmH05\n' +
                '80WmODD3dEuAtM7myINx4hDS9afsENC8rLXW2pTF/yC2l+BcT56nKgw6hXWkHMC6\n' +
                '7vFXT3w/IhBPAK84yH9bfNmQt9YIacEdfunVfgMLXtl3kcsXoLOslLEWcAFY4QY7\n' +
                'd4DK7PcAtA1vEQ34SQugqsSxZkAlHi8TkJVM8QBwAdAoDssnMqDIS/ScCNP8k8Fh\n' +
                'nz9YCmnENdf6MQAKvLRCzbNkGhnWSdlgD2G7z1XE35sDvidZPPdRvRnbTzRgM+wi\n' +
                'buf4MKpQa/NV5CM+cPZBBHl+TByMRQIDAQABAoICAAgmkKPvaUGIZfOAAKqk4jWH\n' +
                '2IbjfizaTYBpFkNyyWncMqkWyCGTporttlYK7woOJPvLFspDcKr1MIMtHPLzp0Ir\n' +
                '2c3f1twk2DHA8p9CWW9qdY/2S95SfMS99tQzEN2u6U1UrMDcPOGZh/Kn9s6QXOO8\n' +
                'sRBKYVcPgAxpy8pS2NazVc+q3y1/qqIjCuyP1tP9WhfxCGSpRA+qYDwNWAi3yU2w\n' +
                'GcniZHEJv5EHl54rwiWGNqP197ONXjqTq/Qqi8Rkp3p/TMSTGdadQbbhbWIWicfa\n' +
                'wRLOAE7pPch0NsxprspyAruz+fAQU3TsIul9tzuHi4YOZHoWYE7nmskTnsCTlIUW\n' +
                'sAWA96XnlIEu/djnW5jC54CjhqjOt8BORh+ZZvHbvyvWWPQmphfan+ma5TbobtCQ\n' +
                '0e4HJyl6wO1JVYz2pazGVMTR4vY3hHgNJ9iBvNEvB87ji1AHW19RiolDFF7YwDwD\n' +
                'l4NC5PdZLFpyGIiNVAKHufdfuE1HkQ/Sbm6gav1VcmpmCJ4lxnSrS5ICsRtPIXuX\n' +
                'Pmpvbp1yhG2hydZKkOztpl0Z+qGTtgbO+X+en/QQeqxAt+ey+rLA5YrmOooYEfSP\n' +
                'ki0oxelRC1IkwK8QCe77BWa1x1G5kuS6AdERw+BLO1/wtz6bRYnb2yxSXfMBhFxQ\n' +
                'W8Rdb3DAu6MIP+AN1gPTAoIBAQDPD2qudo/YNhvpeLv4HLguY5HSNzRYO4b1s0H0\n' +
                'wjgtzN1UhKPEOePqP7RJV/cWOENVLqCP5983RyLTvQJWYs9Pq+gNkWT8HtA5vCnO\n' +
                'oMSqHhCe44v8Kp/zOA/kuC+DyjwzVBs1PXH4ofbHBx2Xb4et5wR+c/GqzSW1P/WY\n' +
                'qq9fvyFqVnxNfJgNlPr4uIdzeKjKdhpmRU/ng1BV06t8rJFmW5cZxO3EshBK041M\n' +
                'tyfEEEj2i1qtpcyw720z/VTV5J9p1VQBh51kyxuMiwkK/2y5hcD/NpZ1dAciz8v+\n' +
                'Mpf8eE6Ru5Og8VxBqkXH5/hLQukUx8RcabquTbMzs7BP9/QbAoIBAQDImqvXouE8\n' +
                '06Bvgr2IXPFUzmD1y+d8PjWDRiXHerTscPYpmzFfcAMUBVXbKi8aD78nLJ7y2VIK\n' +
                '2NmoC90MZVZL8VQY/zCGp6gQ2q5ilF7G0r+FlViftWrqkn6DXRLRHotWc9GhJqrL\n' +
                'YL9OFBS12dht2HuZsxMMevueC6EkCpAcYCMWUP9fySKDJjB+v0uOYBpzgvTg0sal\n' +
                'ODWDeHMRzPOd230pyYZF2vaLOQEHf9zSIY3iHoITIWc+dq4TnR9fLkZ3EIzkLhF8\n' +
                'aJaCya8THv+rscwL5wO9tDO7yuNIZA0f6haDALWRWX2wNdjaF+hm8zeKLLeuis4S\n' +
                'pLxtwIg+T8cfAoIBAHLKvD0ek96tGMpV2ffSjDWDk/s0CbwEvGyIxb8Y0aZqliXe\n' +
                'JyCJa5aZXKzwrJZP+NxHrlI5nWF6+Y7jkWEtBHvJ9StYeODhgFURwSfBr2YUpug/\n' +
                'hIL3apefdAg8KHNq8fcO4MqiVwYdXL+4bSpgdZruoWotg0RK2WXjoJfTwMhXIQJg\n' +
                'EievNGkLOBwdyVI2CXW9BiO+t27FOQtr/v1uemmBy4JIz/ylLy0cnZBzVgN3d8vf\n' +
                'NBVi/tj009jn0FmIluxIjXsPoS2ZAJvpFMlZFADCa13R+JYDDlW5WAGEMQiR9hUL\n' +
                'JewrAxeQe4E5VEj9PlT77xvArfMmNnwqWUvsThMCggEAcNNtay7U990fExi5eQSt\n' +
                'R0F8D0LLw3lJp7fAb913/LPb/7KlpkPdt1j43Pdw3nuUy3exPm00U517baSeguZM\n' +
                'DxKAdj6xEEsjn7ce9Zr1Y2YNChjha5IhvCUAuumSN8OyIsGpWbXhwdl8P3HT5CPO\n' +
                'MpnbiqrJP++7rTxlOVwniY4YreiIeVsq6hCEngUBfeZXejhhekGSMELY9kS8k3pu\n' +
                'Wo6kauhJeOiaWduJ1Kn5jMYKgu8dwZy78MnXRnjMuD/SqgzI8V1nwE0iuhStP1fj\n' +
                '/LFXTip0VDISFsEZ7BE5wIVse+neNQ3cP0tJ2AAyWhTZXAGinay8EohM4n2zIzjD\n' +
                'iQKCAQEAjbg1ljw/h6D1IImZdeEwf5GcssQra+d9Is1YhK+scZcJNxsAYlT39eGc\n' +
                'ocDqOyevv8pV3d8Dtor4p8tzf2QtNVsOfxpM4LurR0BjWarvTqs0o/oCvOxN3DFs\n' +
                'y2lxYsH43/jyTKFx90fz8GR0Q8eOmULKhLcyfn0ezHyby18V8BJP4jc5KlTAGZbi\n' +
                'PshYHSciPaFoa1evqnFmMamR26hSAVaA7TyMOehXBhzU3z4ThPSsk58ldmnqdz1k\n' +
                'Kp7GivIEHX4OzvKdF30ra5HaQ2iw9Ka376MZx6pmDRoweHb+eiWT8BnXsbrgdDac\n' +
                '3yyhq+mRUMWTKi8e2XDaQX3TqmFM5g==\n' +
                '-----END PRIVATE KEY-----';

            download.downloadBlob = jasmine.createSpy('downloadSpy');
            service(cert, key, '1234').then(function () {
                expect(download.downloadBlob).toHaveBeenCalled();
            })
        }))
    })
});
