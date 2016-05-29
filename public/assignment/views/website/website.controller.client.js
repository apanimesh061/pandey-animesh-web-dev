(function() {

    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", EditWebsiteController)
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController);

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
    
    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function init() {
            vm.website = angular.copy(WebsiteService.findWebsiteById(vm.wid));
        }
        init();

        function updateWebsite() {
            WebsiteService.updateWebsite(vm.wid, vm.website);
            $location.url("/user/"+ vm.uid + "/website");
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.wid);
            $location.url("/user/"+ vm.uid + "/website");
        }
    }

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;

        function init() {
            vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        }
        init();
    }

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;
        vm.uid = $routeParams.uid;

        function createWebsite(name, description) {
            var id = (name + description).hashCode();
            var newWebsite = {
                _id: id,
                name: name,
                developerId: vm.uid,
                description: description
            };

            WebsiteService.createWebsite(vm.uid, newWebsite);
            $location.url("/user/" + vm.uid + "/website");
        }
    }

})();
