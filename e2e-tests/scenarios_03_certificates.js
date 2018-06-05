'use strict';

describe('Anath Client', function() {
    describe('Certificates', function () {
        beforeEach(function () {
            browser.get('index.html#!/Certificates');
        });

        it('should create a certificate', function () {
            var numberOfCertificates;
            element.all(by.css('.validCertificateItem')).then(function (elements) {
                numberOfCertificates = elements.length;
                browser.get('index.html#!/Create');
                element(by.model('ctrl.newCert.use')).click();
                browser.sleep(500);
                element(by.id('thisIsATestuse')).click();
                browser.sleep(500);
                element(by.id('createButton')).click();
                browser.sleep(4000);
                browser.get('index.html#!/Certificates');
                expect(element.all(by.css('.validCertificateItem')).count()).toBe(numberOfCertificates + 1);
            })
        });

        it('should not create a certificate if it already exists', function () {
            var numberOfCertificates;
            element.all(by.css('.validCertificateItem')).then(function (elements) {
                numberOfCertificates = elements.length;
                browser.get('index.html#!/Create');
                element(by.model('ctrl.newCert.use')).click();
                browser.sleep(500);
                element(by.id('thisIsATestuse')).click();
                browser.sleep(500);
                element(by.id('createButton')).click();
                browser.sleep(4000);
                browser.get('index.html#!/Certificates');
                expect(element.all(by.css('.validCertificateItem')).count()).toBe(numberOfCertificates);
            })
        });

        it('should revoke an existing certificate', function () {
            var numberOfCertificates;
            element.all(by.css('.validCertificateItem')).then(function (elements) {
                numberOfCertificates = elements.length;
                element.all(by.css('.revokeButton')).get(0).click();
                element(by.css('.md-confirm-button')).click();
                browser.sleep(3000);
                expect(element.all(by.css('.validCertificateItem')).count()).toBe(numberOfCertificates - 1);
            })
        });
    });
});