'use strict';

describe('Anath Client', function () {
    describe('Admin', function () {
        beforeEach(function () {
            browser.get('index.html#!/Admin');
        });

        it('should create a new use', function () {
            element(by.id('toggelUses')).click();
            var numberOfUses;
            element.all(by.css('.useItem')).then(function (elements) {
                numberOfUses = elements.length;
                element(by.model('ctrl.useInput.use')).sendKeys("thisIsATestuse")
                element(by.model('ctrl.useInput.configuration')).sendKeys("This is the config of a testuse");
                element(by.id('saveUseButton')).click();
                var newNumberOfUses = element.all(by.css('.useItem')).count();
                browser.sleep(500);
                console.log(numberOfUses);
                expect(newNumberOfUses).toBe(numberOfUses + 1);
            });
        });

        it('should create a new user', function () {
            var numberOfUsers;
            element.all(by.css('.userItem')).then(function (elements) {
                numberOfUsers = elements.length;
                element(by.model('ctrl.userInput.email')).sendKeys("testuser02@localhost.localdomain")
                element(by.model('ctrl.userInput.firstname')).sendKeys("Testuser01");
                element(by.model('ctrl.userInput.lastname')).sendKeys("Testuser01");
                element(by.model('ctrl.userInput.password')).sendKeys("1234ABcdEF");
                element(by.id('saveUserButton')).click();
                browser.sleep(5000);
                var newNumberOfUsers = element.all(by.css('.userItem')).count();
                browser.sleep(500);
                expect(newNumberOfUsers).toBe(numberOfUsers + 1);
            })
        });

    })
});