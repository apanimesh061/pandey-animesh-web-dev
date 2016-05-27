(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);
    
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

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password, passwordVerified) {
            if (username && password && passwordVerified) {
                if (UserService.findUserByUsername(username) !== null) {
                    vm.error = "Username is already in use";
                }
                else if (password === passwordVerified) {
                    // var id = (username + password).hashCode();
                    var id = uuidService.v4();
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

})();
