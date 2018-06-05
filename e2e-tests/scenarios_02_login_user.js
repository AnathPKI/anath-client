'use strict';

describe('Anath Client', function() {
    describe('Login User', function () {
        beforeEach(function () {
            browser.get('index.html#!/Login');
        });

        it('should logout the admin', function () {
            browser.get('index.html#!/Certificates');
            element(by.id('userMenu')).click();
            element(by.id('logoutButton')).click();
            expect(browser.getCurrentUrl()).toMatch("/Login");
        });

        it('should login as testuser01 with correct credentials', function () {
            element(by.model('ctrl.username')).sendKeys("testuser02@localhost.localdomain");
            element(by.model('ctrl.password')).sendKeys("1234ABcdEF");
            element(by.id('loginButton')).click();
            browser.sleep(5000);
            expect(browser.getCurrentUrl()).toMatch("/Certificates");
        });
    });
});