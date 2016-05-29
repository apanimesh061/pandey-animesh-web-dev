(function() {

    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("WidgetEditController", WidgetEditController);

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

    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        vm.getTrustedHTML = getTrustedHTML;
        vm.getTrustedURL = getTrustedURL;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pid);
        }
        init();

        function getTrustedHTML(widget) {
            return $sce.trustAsHtml(widget.text);
        }

        function getTrustedURL(widget) {
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function WidgetEditController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        function init() {
            vm.widget = angular.copy(WidgetService.findWidgetById(vm.wgid));
        }
        init();

        function updateWidget() {
            WidgetService.updateWidget(vm.wgid, vm.widget);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.wgid);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
        }
    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;

        vm.createWidget = createWidget;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        function createWidget(widgetType) {
            var id = (widgetType.toString() + (new Date()).getTime().toString()).hashCode();;
            var newWidget = {
                _id: id,
                widgetType: widgetType,
                pageId: vm.pid
            };
            WidgetService.createWidget(vm.pid, newWidget);
            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + id);
        }
    }

})();
