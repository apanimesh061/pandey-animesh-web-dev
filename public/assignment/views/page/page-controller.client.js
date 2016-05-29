/**
 * Created by animesh on 5/27/16.
 */

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
        return hash;
    };

    function EditPageController(PageService, $location, $routeParams) {
        var vm = this;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        function init() {
            vm.page = angular.copy(PageService.findPageById(vm.pid));
        }
        init();

        function updatePage() {
            console.log(vm.pid);
            console.log(vm.page);
            PageService.updatePage(vm.pid, vm.page);
            $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
        }

        function deletePage() {
            PageService.deletePage(vm.pid);
            $location.url("/user/"+ vm.uid + "/website/" + vm.wid + "/page");
        }
    }

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.wid);
        }
        init();
    }

    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.createPage = createPage;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        function createPage(name, title) {
            var id = (name + title).hashCode().toString();
            var newPage = {
                _id: id,
                name: name,
                websiteId: vm.wid,
                title: title
            };
            console.log(newPage);
            PageService.createPage(vm.wid, newPage);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
        }
    }

})();
