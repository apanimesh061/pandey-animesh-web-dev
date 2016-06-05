module.exports = function(app) {
    var dummyWebsites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" },
        { "_id": "678", "name": "Checkers",    "developerId": "123" },
        { "_id": "789", "name": "Chess",       "developerId": "234" }
    ];

    var websites = dummyWebsites;

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

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
    
    function createWebsite(request, response) {
        var newWebsite = request.body;
        newWebsite._id = (newWebsite.name + (new Date()).getDate().toString()).hashCode().toString();
        websites.push(newWebsite);
        response.sendStatus(200);
    }

    function deleteWebsite(request, response) {
        var websiteId = request.params.websiteId;
        for(var i in websites) {
            if(websites[i]._id === websiteId) {
                websites.splice(i, 1);
                response.sendStatus(200);
                return true;
            }
        }
        response.status(404)
            .send("Unable to remove website with ID " + websiteId);
    }

    function findAllWebsitesForUser(request, response) {
        var userId = request.params.userId;
        var result = [];
        for(var i in websites) {
            if(websites[i].developerId === userId) {
                result.push(websites[i]);
            }
        }
        response.send(result);
    }

    function findWebsiteById(request, response) {
        var websiteId = request.params.websiteId;
        for(var i in websites) {
            if(websites[i]._id === websiteId) {
                response.json(websites[i]);
                return;
            }
        }
        response.status(400)
            .send("Website with ID " + websiteId + " not found");
    }

    function updateWebsite(request, response) {
        var website = request.body;
        var websiteId = request.params.websiteId;
        for(var i in websites) {
            if(websites[i]._id === websiteId) {
                websites[i].name = website.name;
                websites[i].description = website.description;
                response.sendStatus(200);
                return true;
            }
        }
        response.status(400)
            .send("Website with ID " + websiteId + " not found");
    }
};