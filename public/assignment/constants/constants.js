var util = require('util');

var FLICKR_API_KEY = "33c19c6c05cc6888fb65f6a6e28b0eac";
var FLICKR_API_SECRET = "cd8a153e731db659";
var flickr_url = util.format("https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=%s&text=%s", FLICKR_API_KEY);

module.exports = Object.freeze({
    WEB_APP_NAME: "WebAppMaker",
    FLICKR_URL: flickr_url,

    FLICKS_SERVICE_NAME: "FlickrService",
    PAGE_SERVICE_NAME: "PageService",
    USER_SERVICE_NAME: "UserService",
    WEBSITE_SERVICE_NAME: "WebsiteService",
    WIDGET_SERVICE_NAME: "WidgetService",

    WEBSITE_ENDPOINT: "/api/website/",
    PAGE_ENDPOINT: "/api/page/",
    USER_ENDPOINT: "/api/user/",
    WIDGET_ENDPOINT: "/api/widget/"
});