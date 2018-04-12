angular.module('anath')

    .factory('UserService', function ($resource, appConfig) {
        var user;
        
        return function (callBack) {
                $resource(appConfig.AS_BACKEND_BASE_URL + "whoami").get({},
                    function (userData) {
                        user = userData;
                        callBack(user);
                    }, function (response) {
                        if (response.status === 401) {
                            window.location = "/#!/Login";
                        }
                    }
                )
        }
    })

    .factory('AuthenticationService', function ($http, $resource, appConfig, $location) {
        var service = {};

        service.login = function (username, password, callBack) {
            $resource(appConfig.AS_BACKEND_BASE_URL + "login/jwt", {}, {
                login: {
                    method: "POST"
                }
            }).login({username: username, password: password},
                function (response, headers) {
                    var token = headers("Authorization");
                    if (token !== null) {
                        localStorage.userToken = token;
                        //$http.defaults.headers.common['Authorization'] = token;

                        callBack(true);
                    } else
                        callBack(false);
                }, function () {
                    callBack(false);
                })
        };

        service.logout = function () {
            delete localStorage.userToken;
            $http.defaults.headers.common['Authorization'] = '';

            $location.path("/Login");
        };

        return service;
    });