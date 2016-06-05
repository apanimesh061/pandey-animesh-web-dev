module.exports = function(app) {
    var dummyPages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456" },
        { "_id": "432", "name": "Post 2", "websiteId": "456" },
        { "_id": "543", "name": "Post 3", "websiteId": "456" }
    ];

    var pages = dummyPages;

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

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

    function createPage(request, response) {
        var newPage = request.body;
        newPage._id = (newPage.name + newPage.title + (new Date()).getDate().toString()).hashCode().toString();
        pages.push(newPage);
        response.sendStatus(200);
    }

    function findAllPagesForWebsite(request, response) {
        var websiteId = request.params.websiteId;
        var result = [];
        for(var i in pages) {
            if(pages[i].websiteId === websiteId) {
                result.push(pages[i]);
            }
        }
        response.send(result);
    }

    function findPageById(request, response) {
        var pageId = request.params.pageId;
        for(var i in pages) {
            if(pages[i]._id === pageId) {
                response.json(pages[i]);
                return;
            }
        }
        response.status(400)
            .send("Page with ID " + pageId + " not found");
    }

    function updatePage(request, response) {
        var page = request.body;
        var pageId = request.params.pageId;

        for(var i in pages) {
            if(pages[i]._id === pageId) {
                pages[i].name = page.name;
                pages[i].title = page.title;
                response.sendStatus(200);
                return true;
            }
        }
        response.status(400)
            .send("Page with ID " + pageId + " not found");
    }

    function deletePage(request, response) {
        var pageId = request.params.pageId;
        for(var i in pages) {
            if(pages[i]._id === pageId) {
                pages.splice(i, 1);
                response.sendStatus(200);
                return true;
            }
        }
        response.status(404)
            .send("Unable to remove page with ID " + pageId);
    }
};
