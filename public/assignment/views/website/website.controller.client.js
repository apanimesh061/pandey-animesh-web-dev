(function() {
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", EditWebsiteController)
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController);

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function init() {
            vm.website = WebsiteService
                .findWebsiteById(vm.wid)
                .then(
                    function(response) {
                        vm.website = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function updateWebsite() {
            WebsiteService
                .updateWebsite(vm.wid, vm.website)
                .then(
                    function(response) {
                        vm.success = "Website successfully updated";
                        $location.url("/user/"+ vm.uid + "/website");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.wid)
                .then(
                    function(response) {
                        vm.success = "Website successfully deleted";
                        $location.url("/user/"+ vm.uid + "/website");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        function init() {
            WebsiteService
                .findWebsitesByUser(vm.uid)
                .then(
                    function(response) {
                        vm.websites = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();
    }

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;
        vm.uid = $routeParams.uid;

        function createWebsite(name, description) {
            if (null != name) {
                var newWebsite = {
                    name: name,
                    developerId: vm.uid,
                    description: description
                };

                WebsiteService
                    .createWebsite(vm.uid, newWebsite)
                    .then(
                        function(response) {
                            vm.success = "Created new website";
                            $location.url("/user/" + vm.uid + "/website");
                        },
                        function(error) {
                            vm.error = error.data;
                        }
                    );

            } else {
                vm.error = "Website name has not been entered. Cannot proceed."
            }
        }
    }

})();
