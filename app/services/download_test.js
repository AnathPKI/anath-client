"use strict";

describe('anath download service', function () {
    beforeEach(module('anath'));

    describe('DownloadService', function () {
        var service;
        var createElement;

        beforeEach(inject(function (DownloadService) {
            service = DownloadService;
            createElement = document.createElement;
        }));

        afterEach(inject(function () {
            document.createElement = createElement;
        }));

        it('should create a link', inject(function() {
            document.createElement = jasmine.createSpy().and.returnValue(document.createElement('a'));
            service.downloadTextFile("testcontent", "testfile.txt");
            expect(document.createElement).toHaveBeenCalled();
        }));

        it('should append the link to the body', inject(function () {
            document.body.appendChild = jasmine.createSpy();
            document.body.removeChild = jasmine.createSpy();
            service.downloadTextFile("testcontent", "testfile.txt");
            expect(document.body.appendChild).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalled();
        }));

        it('should click the link', inject(function () {
            document.body.appendChild = function () {};
            document.body.removeChild = function () {};
            var element = {
                click: jasmine.createSpy().and.returnValue(),
                setAttribute: function () {},
                style: {}
            };
            document.createElement = jasmine.createSpy().and.returnValue(element);
            service.downloadTextFile("testcontent", "testfile.txt");
            expect(element.click).toHaveBeenCalled();
        }))
    })
});