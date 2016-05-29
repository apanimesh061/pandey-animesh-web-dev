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
        return hash;
    };

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        function login(username, password) {

            console.log(username);

            var user = UserService.findUserByCredentials(username, password);
            if(user) {
                var id = user._id;
                $location.url("/user/" + id);
            }
            else {
                vm.error = "You have entered wrong credentials";
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, passwordVerified) {
            if (username && password && passwordVerified) {
                if (UserService.findUserByUsername(username) !== null) {
                    vm.error = "Username is already in use";
                }
                else if (password === passwordVerified) {
                    var currentTimeStamp = new Date().getTime().toString();
                    var id = (username + password + currentTimeStamp).hashCode().toString();
                    var newUser = {
                        _id: id,
                        username: username,
                        password: password,
                        firstName: '',
                        lastName: '',
                        email: ''
                    };
                    UserService.createUser(newUser);
                    $location.url("/user/" + id);
                }
                else {
                    vm.error = "Password and Verification password do not match";
                }
            }
            else {
                vm.error = "Please enter username and password";
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;

        var uid = $routeParams["uid"];

        function init() {
            vm.user = angular.copy(UserService.findUserById(uid));
        }
        init();

        function updateUser() {
            var result = UserService.updateUser(vm.user._id, vm.user);
            if(result) {
                vm.success = "User successfully updated";
            }
            else {
                vm.error = "User not successfully updated";
            }
        }
    }

})();
