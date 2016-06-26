var mongoose = require("mongoose");

module.exports = function () {
    var WebsiteSchema = require("./website.schema.server")();
    var ProjWebsite = mongoose.model("ProjWebsite", WebsiteSchema);

    return {
        createWebsite: createWebsite,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        addPageIdToWebsite: addPageIdToWebsite,
        removePageIdFromWebsite: removePageIdFromWebsite
    };

    function addPageIdToWebsite(pageId, websiteId) {
        return ProjWebsite.findOne({_id: websiteId},
            function (err, doc) {
                doc.pages.push(pageId);
                doc.save();
            });
    }

    function removePageIdFromWebsite(pageId, websiteId) {
        return ProjWebsite.findOne({_id: websiteId},
            function (err, doc) {
                doc.pages.pull(pageId);
                doc.save();
            });
    }

    function createWebsite(userId, website) {
        website._user = userId;
        return ProjWebsite.create(website);
    }

    function findAllWebsitesForUser(userId) {
        return ProjWebsite.find({_user: userId});
    }

    function findWebsiteById(websiteId) {
        return ProjWebsite.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return ProjWebsite.update(
            {_id: websiteId},
            {
                $set: {
                    name: website.name,
                    description: website.description
                }
            }
        );
    }

    function deleteWebsite(websiteId) {
        return ProjWebsite.remove({_id: websiteId});
    }
};