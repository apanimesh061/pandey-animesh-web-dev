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
        return Math.abs(hash);
    };

    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;
        vm.getTrustedHTML = getTrustedHTML;
        vm.getTrustedURL = getTrustedURL;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        function init() {
            vm.widgets = WidgetService
                .findWidgetsByPageId(vm.pid)
                .then(
                    function(response) {
                        console.log(response.data);
                        vm.widgets = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
        init();

        function getTrustedHTML(widget) {
            // REF: http://stackoverflow.com/questions/23838025/compiling-a-trusted-resource-url-in-angular-through-a-filter-and-directive
            return $sce.trustAsHtml(widget.text);
        }

        function getTrustedURL(widget) {
            var urlParts = widget.url.split("/");
            // extract the id of the video
            // REF: http://stackoverflow.com/questions/23838025/compiling-a-trusted-resource-url-in-angular-through-a-filter-and-directive
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

        var redirectUrl = "/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget";

        function init() {
            WidgetService
                .findWidgetById(vm.wgid)
                .then(
                    function(response) {
                        vm.widget = response.data;
                    },
                    function(error) {
                        vm.error = error.data;
                    });
        }
        init();

        function updateWidget() {
            WidgetService
                .updateWidget(vm.wgid, vm.widget)
                .then(
                    function(response) {
                        vm.success = "Widget successfully updated";
                        $location.url(redirectUrl);
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                )
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.wgid)
                .then(
                    function(response) {
                        vm.success = "Widget successfully deleted";
                        $location.url(redirectUrl);
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                )
        }
    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;

        vm.createWidget = createWidget;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        console.log("New widget controller id data" + vm);

        function createWidget(widgetType) {
            var newWidget = {
                widgetType: widgetType,
                pageId: vm.pid
            };
            console.log("widget text boxes data: " + newWidget);
            WidgetService
                .createWidget(vm.pid, newWidget)
                .then(
                    function(response) {
                        var currentWidgetId = response.data;
                        console.log("currentWidgetId: " + currentWidgetId);
                        $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + currentWidgetId);
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }
    }
})();
