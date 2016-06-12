module.exports = function(app, models) {

    var widgetModel = models.widgetModel;
    var pageModel = models.pageModel;

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/api/page/:pageId/widget", reorderWidget); // "/api/page/:pageId/widget?start=start&end=end"


    function reorderWidget(req, res) {
        var startIndex = req.query['start'];
        var endIndex = req.query['end'];
        var pageId = req.params.pageId;

        widgetModel
            .reorderWidget(startIndex, endIndex, pageId)
            .then(
                function(widget) {
                    res.sendStatus(200);
                },
                function(error) {
                    res.status(404).send("Unable to reorder widget on page " + pageId);
                }
            )
    }

    function uploadImage(req, res) {


        var widgetId      = req.body.widgetId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var userId        = req.body.userId;
        var width         = req.body.width;
        var myFile        = req.file;

        // if no file has been selected, don't set the URL and don't upload any file
        if(myFile == null) {
            res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function(widget) {
                    widget.url = "/uploads/" + filename;

                    return widgetModel
                        .updateWidget(widgetId, widget)
                },
                function(error) {
                    res.status(404).send(error);
                }
            ).then(
                function(widget) {
                    res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
                },
                function(error) {
                    res.status(404).send("Unable to update widget with ID " + widgetId);
                }
            )
    }

    function createWidget(req, res) {
        var newWidget = req.body;
        var pageId = req.params.pageId;

        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function(widgets) {
                    newWidget.order = widgets.length;

                    return widgetModel
                        .createWidget(pageId, newWidget)
                },
                function(error) {
                    res.status(400).send(error);
                }
            ).then(
            function(widget) {
                return pageModel
                    .addWidgetIdToPage(widget._id, pageId)
                    .then(
                        function(response) {
                            res.json(widget);
                        },
                        function(error) {
                            res.status(400).send(error);
                        }
                    )
            },
            function(error) {
                res.status(400).send(error);
            }
        );
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function(widgets) {
                    res.json(widgets);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res.status(404).send(error);
                }
            );
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = req.params.widgetId;

        widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function(widget) {
                    res.sendStatus(200);
                },
                function(error) {
                    res.status(404).send("Unable to update widget with ID " + widgetId);
                }
            );
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function(widget) {
                    var pageId = widget._page;
                    return pageModel
                        .removeWidgetIdFromPage(widgetId, pageId)
                },
                function(error) {
                    res.status(404).send("Unable to find widget " + widgetId);
                }
            ).then(
                function(status) {
                    return widgetModel
                        .deleteWidget(widgetId)
                },
                function(error) {
                    res.status(404).send("Unable to remove widget ID " + widgetId + " from page " + pageId);
                }
            ).then(
                function(status) {
                    res.sendStatus(200);
                },
                function(error) {
                    res.status(404).send("Unable to remove widget with ID " + widgetId);
                }
        );
    }
};