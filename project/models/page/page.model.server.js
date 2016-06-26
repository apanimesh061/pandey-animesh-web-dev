var mongoose = require("mongoose");

module.exports = function () {
    var PageSchema = require("./page.schema.server")();
    var ProjPage = mongoose.model("ProjPage", PageSchema);

    function addWidgetIdToPage(widgetId, pageId) {
        return ProjPage.findOne({_id: pageId},
            function (err, doc) {
                doc.widgets.push(widgetId);
                doc.save();
            });
    }

    function removeWidgetIdFromPage(widgetId, pageId) {
        return ProjPage.findOne({_id: pageId},
            function (err, doc) {
                doc.widgets.pull(widgetId);
                doc.save();
            });
    }

    function createPage(websiteId, page) {
        page._website = websiteId;
        return ProjPage.create(page);
    }

    function findAllPagesForWebsite(websiteId) {
        return ProjPage.find({_website: websiteId});
    }

    function findPageById(pageId) {
        return ProjPage.findById(pageId);
    }

    function updatePage(pageId, page) {
        return ProjPage.update(
            {_id: pageId},
            {
                $set: {
                    name: page.name,
                    title: page.title
                }
            }
        );
    }

    function deletePage(pageId) {
        return ProjPage.remove({_id: pageId});
    }

    return {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        addWidgetIdToPage: addWidgetIdToPage,
        removeWidgetIdFromPage: removeWidgetIdFromPage
    };

};