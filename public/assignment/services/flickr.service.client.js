(function () {
    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);
    
    function FlickrService($http) {
        var FLICKR_API_KEY = "33c19c6c05cc6888fb65f6a6e28b0eac";
        var FLICKR_API_SECRET = "cd8a153e731db659";
        var flickr_url = util.format("https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=%s&text=%s", FLICKR_API_KEY);

        function searchPhotos(searchTerm) {
            return $http.get(util.format(flickr_url, searchTerm))
        }
        return {
            searchPhotos: searchPhotos
        };
    }
})();