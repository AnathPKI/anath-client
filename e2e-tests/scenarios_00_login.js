'use strict';

describe('Anath Client', function() {
    describe('Login', function () {
        beforeEach(function () {
            browser.get('index.html#!/Login');
        });

        it('should not login with wrong password', function () {
            element(by.model('ctrl.username')).sendKeys("admin@localhost.localdomain");
            element(by.model('ctrl.password')).sendKeys("sdfsdfsdfsdf");
            element(by.id('loginButton')).click();
            browser.sleep(5000);
            expect(element(by.id('loginAlertUser')).isDisplayed()).toBeTruthy();
            expect(element(by.id('loginAlertPW')).isDisplayed()).toBeTruthy();
        });

        it('should not login with wrong username', function () {
            element(by.model('ctrl.username')).sendKeys("gdfssd@gsdf.ch");
            element(by.model('ctrl.password')).sendKeys("cb3624d8-c621-4d07-89c5-f836b598e9f9");
            element(by.id('loginButton')).click();
            browser.sleep(5000);
            expect(element(by.id('loginAlertUser')).isDisplayed()).toBeTruthy();
            expect(element(by.id('loginAlertPW')).isDisplayed()).toBeTruthy();
        });

        it('should login as admin with correct credentials', function () {
            element(by.model('ctrl.username')).sendKeys("admin@localhost.localdomain");
            element(by.model('ctrl.password')).sendKeys("cb3624d8-c621-4d07-89c5-f836b598e9f9");
            element(by.id('loginButton')).click();
            browser.sleep(5000);
            expect(browser.getCurrentUrl()).toMatch("/Certificates");
        })
    })
})