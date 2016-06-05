(function () {
    
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    String.prototype.hashCode = function() {
        var hash = 0;
        var char;
        if (this.length == 0)
            return hash;
        for (var i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        function login(username, password) {
            UserService
                .findUserByCredentials(username, password)
                .then(
                    function(response) {
                        var user = response.data;
                        if(user) {
                            var id = user._id;
                            $location.url("/user/" + id);
                        }
                    },
                    function(error) {
                        vm.error = "You have entered wrong credentials";
                    }
                );
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;
        function register(username, password, passwordVerified) {
            if (username && password && passwordVerified) {
                if (password === passwordVerified) {
                    UserService
                        .createUser(username, password)
                        .then(
                            function(response) {
                                var user = response.data;
                                $location.url("/user/" + user._id);
                            },
                            function(error) {
                                vm.error = error.data;
                            }
                        );
                } else {
                    vm.error = "Password and Verification password do not match";
                }
            } else {
                vm.error = "Please enter username and password";
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;

        var uid = $routeParams["uid"];

        function init() {
            UserService
                .findUserById(uid)
                .then(
                    function(response) {
                        vm.user = response.data
                    },
                    function(error) {
                        vm.error = "Could not find the User";
                    }
                )
        }
        init();

        function updateUser() {
            UserService
                .updateUser(uid, vm.user)
                .then(
                    function(response) {
                        vm.success = "User successfully updated";
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                )
        }
    }

})();
