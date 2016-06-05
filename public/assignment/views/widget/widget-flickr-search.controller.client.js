(function () {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    /**
     * Here the FlickrService and WidgetService have been injected
     * @param $location
     * @param $routeParams
     * @param FlickrService
     * @param WidgetService
     * @constructor
     */
    function FlickrImageSearchController($location, $routeParams, FlickrService, WidgetService) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        /**
         * This snippet is from Assignment 4 document
         * @param searchTern
         */
        function searchPhotos(searchTern) {
            FlickrService
                .searchPhotos(searchTern)
                .then(
                    function(response) {
                        data = response.data.replace("jsonFlickrApi(","");
                        data = data.substring(0,data.length - 1);
                        data = JSON.parse(data);
                        vm.photos = data.photos;
                    },
                    function(error) {
                        vm.error = error.data
                    }
                )
        }

        /**
         * This snippet is taken from Assignment 4 document.
         * Here you first find the image in the DB and if found the image is
         * sent to another helpder function that handles that updation of the
         * widgets
         *
         * @param photo
         */
        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .findWidgetById(vm.wgid)
                .then(
                    function(response) {
                        postSelectUpdateWidget(response, url)
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                );
        }

        /**
         * This accepts the response from findWidgetById which is a JSON
         *
         * @param response
         * @param url
         */
        function postSelectUpdateWidget(response, url) {
            var widget = response.data;
            widget.url = url;
            WidgetService
                .updateWidget(vm.wgid, widget)
                .then(
                    function(response) {
                        vm.success = "Image added to widgets";
                        $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + vm.wgid);
                    },
                    function(error) {
                        vm.error = error.data;
                    }
                )
        }
    }

})();
