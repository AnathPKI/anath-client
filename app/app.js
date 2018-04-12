'use strict';

// Declare app level module which depends on views, and components
angular.module('anath', [
    'ngRoute',
    'ngMaterial',
    'ngResource',
    'angular-jwt',
    'anath.view1',
    'anath.view2',
    'anath.viewCertificates',
    'anath.viewCreateCertificate',
    'anath.viewLogin'
])

    .constant('appConfig', {
        'AS_BACKEND_BASE_URL': 'http://192.168.191.175:8080/',
        'title': "Anath",
        'ContentType': 'application/vnd.anath.v1+json',
        'ContentTypeUser': 'application/vnd.anath.user.v1+json'
    })

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/Certificates'});
    }])

    .config(['$httpProvider', 'appConfig', function ($httpProvider, appConfig) {
        $httpProvider.defaults.headers.common['X-Force-Content-Type'] = appConfig.ContentType;
        $httpProvider.defaults.headers.post['Content-Type'] = appConfig.ContentType;
        $httpProvider.defaults.headers.put['Content-Type'] = appConfig.ContentType;
    }])

    .decorator('$httpBackend', ['$delegate', 'appConfig', function($delegate, appConfig) {
        return function() {
            var headers = arguments[4];
            var contentType = (headers != null ? headers['X-Force-Content-Type'] : void 0);
            if (contentType != null && headers['Content-Type'] == null) {
                headers['Content-Type'] = contentType;
            }
            return $delegate.apply(null, arguments);
        };
    }])

    .run(function (appConfig, $rootScope, jwtHelper, $injector, $http, $interval, UserService) {
        $rootScope.title = appConfig.title;

        function checkTokenExpired() {
            if(localStorage.userToken) {
                var token = localStorage.userToken;
                if (jwtHelper.isTokenExpired(token)) {
                    $injector.get('AuthenticationService').logout();
                } else {
                    $http.defaults.headers.common['Authorization'] = token;
                }
            }
        }

        checkTokenExpired();

        $interval(checkTokenExpired, 30000);

        UserService(function (user) {
            $rootScope.admin = user.admin;
            $rootScope.userName = user.user;
        })
    });
