'use strict';

angular.module('anath.viewAdmin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Admin', {
            templateUrl: 'viewAdmin/viewAdmin.html',
            controller: 'ViewAdminCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewAdminCtrl', function (UsesService, UserService, $resource) {
        var ctrl = this;

        /*** Begin Use functions ***/
        ctrl.getUses = function () {
            UsesService.uses.get({}, function (response) {
                ctrl.uses = response.content;
            })
        };
        ctrl.getUses();

        ctrl.getSingleUse = function (link) {
            $resource(link).get({}, function (response) {
                ctrl.useInput = response;
                ctrl.useInput.key = response.use;
            });
        };

        ctrl.submitUse = function () {
            console.log(ctrl.useInput);
            if(ctrl.useInput.links !== undefined) {
                UsesService.uses.update(ctrl.useInput, function (response) {
                    ctrl.getUses();
                    console.log("done");
                })
            } else {
                UsesService.uses.save(ctrl.useInput, function (response) {
                    ctrl.getUses();
                    console.log("Created");
                })
            }
        }

        /*** Begin User functions ***/
        ctrl.getUsers = function () {
            UserService.users.get({}, function (response) {
                ctrl.users = response.content;
            })
        };
        ctrl.getUses();
    })

    .factory('UserService', function ($resource, appConfig) {
        return {
            users: $resource(appConfig.AS_BACKEND_BASE_URL + "users/:id", {
                    "id": "@id"
                }, {
                    update: {
                        method: "PUT"
                    }
                }
            )
        }
    })

    .factory('UsesService', function ($resource, appConfig) {
        return {
            uses: $resource(appConfig.AS_BACKEND_BASE_URL + "uses/:key", {
                    "key": "@key"
                }, {
                    update: {
                        method: "PUT"
                    }
                }
            )
        }
    });