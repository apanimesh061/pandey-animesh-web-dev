(function() {
    angular
        .module("WebAppMaker")
        .controller("EditPageController", EditPageController)
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController);

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

    function EditPageController(PageService, $location, $routeParams) {
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        function init() {
            vm.page = angular.copy(
                PageService
                    .findPageById(vm.pid)
                    .then(
                        function(response) {
                            vm.page = response.data;
                        },
                        function(error) {
                            vm.error = error.data;
                        }
                    )
            );
        }
        init();

        //TODO: "/user/"+ vm.uid + "/website/" + vm.wid + "/page" could be constant

        function updatePage() {
            PageService
                .updatePage(vm.pid, vm.page)
                .then(
                    function(response) {
                        vm.success = "Page successfully updated";
                        $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
            $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
        }

        function deletePage() {
            PageService
                .deletePage(vm.pid)
                .then(
                    function(response) {
                        vm.success = "Page successfully deleted";
                        $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
            $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
        }
    }

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function init() {
            vm.pages = PageService
                .findPageByWebsiteId(vm.wid)
                .then(
                    function(response) {
                        vm.pages = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();
    }

    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.createPage = createPage;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function createPage(name, title) {
            if (name != null) {
                var id = (name + title + new Date().getTime().toString()).hashCode().toString();
                var newPage = {
                    _id: id,
                    name: name,
                    websiteId: vm.wid,
                    title: title
                };
                PageService
                    .createPage(vm.wid, newPage)
                    .then(
                        function(response) {
                            vm.success = "Created new page";
                            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
                        },
                        function(error) {
                            vm.error = error.data;
                        }
                    );
            } else {
                vm.error = "Please enter a valid name";
            }
        }
    }

})();
