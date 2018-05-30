'use strict';

angular.module('anath.viewAdmin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Admin', {
            templateUrl: 'viewAdmin/viewAdmin.html',
            controller: 'ViewAdminCtrl',
            controllerAs: 'ctrl'
        });
    }])

    .controller('ViewAdminCtrl', function (UsesService, UsersService, $resource, $mdToast, AdminService, CertificatesService) {
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
            if (ctrl.useInput.links !== undefined) {
                UsesService.uses.update(ctrl.useInput, function (response) {
                    ctrl.getUses();
                    $mdToast.show($mdToast.simple().textContent('Use Updated!').position("bottom"));
                })
            } else {
                UsesService.uses.save(ctrl.useInput, function (response) {
                    ctrl.getUses();
                    $mdToast.show($mdToast.simple().textContent('Use Created!').position("bottom"));
                })
            }
        };

        /*** Begin User functions ***/
        ctrl.getUsers = function () {
            UsersService.get({}, function (response) {
                ctrl.users = response.content;
            })
        };
        ctrl.getUsers();
        
        ctrl.getSingleUser = function (user) {
            ctrl.userInput = UsersService.get({id: user.id});
        };

        ctrl.submitUser = function () {
            if(ctrl.userInput.links === undefined) {
                UsersService.save(ctrl.userInput, function () {
                    ctrl.getUsers();
                    $mdToast.show($mdToast.simple().textContent('User Created!').position("bottom"));
                });
            } else {
                UsersService.update(ctrl.userInput, function () {
                    ctrl.getUsers();
                    $mdToast.show($mdToast.simple().textContent('User Updated!').position("bottom"));
                });
            }
        };

        CertificatesService.ca(
            function (test) {
                ctrl.showCACreate = false;
            },
            function () {
                ctrl.showCACreate = true;
            }
        );
        ctrl.createNewCA = function () {
            AdminService.ca.create(ctrl.createCA);
        }
    })

    .factory('UsersService', function ($resource, appConfig) {
        return $resource(appConfig.AS_BACKEND_BASE_URL + "users/:id", {
                    "id": "@id"
                }, {
                    update: {
                        method: "PUT",
                        headers: {
                            "Content-Type": appConfig.ContentTypeUser
                        }
                    },
                    get: {
                        headers: {
                            "X-Force-Content-Type": appConfig.ContentTypeUser
                        }
                    },
                    save: {
                        method: "POST",
                        headers: {
                            "Content-Type": appConfig.ContentTypeUser
                        }
                    }
                }
            )
    })

    .factory('UsesService', function ($resource, appConfig) {
        return {
            uses: $resource(appConfig.AS_BACKEND_BASE_URL + "uses/:key", {
                    "key": "@key"
                }, {
                    update: {
                        method: "PUT",
                        "Content-Type": appConfig.ContentTypeUser,
                        "X-Force-Content-Type": appConfig.ContentTypeUser
                    },
                    save: {
                        method: "POST",
                        headers: {
                            "Content-Type": appConfig.ContentTypeUser,
                            "X-Force-Content-Type": appConfig.ContentTypeUser
                        }
                    }
                }
            )
        }
    })

.factory('AdminService', function ($resource, appConfig) {
    return {
        ca: $resource(appConfig.AS_BACKEND_BASE_URL, {}, {
            create: {
                method: "PUT",
                headers: {
                    "Content-Type": appConfig.ContentTypeUser,
                    "X-Force-Content-Type": appConfig.ContentTypeUser
                }
            }
        })
    }
})