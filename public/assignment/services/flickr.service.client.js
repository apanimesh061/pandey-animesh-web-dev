(function() {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    var key = "1a9bd9a407ef23ef7f54823fc61ee739";
    var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

    function FlickrService($http) {

        var api = {
                searchPhotos: searchPhotos
        };
        return api;


        function searchPhotos(searchTerm) {
            return $http.get(urlBase.replace("API_KEY", key).replace("TEXT", searchTerm));
        }

    }

})();