module.exports = function(app) {
    var dummyWidgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%", "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%", "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Other Lorem ipsum</p>"}
    ];

    var widgets = dummyWidgets;

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

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

    /**
     *
     */
    function uploadImage() {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var finalRedirectUrl = "/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;

        if(myFile == null) {
            res.redirect(finalRedirectUrl);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        for(var i in widgets) {
            if (widgets[i]._id === widgetId) {
                widgets[i].url = "/uploads/" + filename;
            }
        }
        res.redirect(finalRedirectUrl);
    }

    function createWidget(request, response) {
        var newWidget = request.body;
        newWidget._id = (newWidget.pageId + newWidget.widgetType + (new Date()).getTime().toString()).hashCode().toString();
        widgets.push(newWidget);
        response.status(200)
            .send(newWidget._id);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        for(var i in widgets) {
            if(widgets[i]._id === widgetId) {
                res.json(widgets[i]);
                return;
            }
        }
        // instead of returning false just send a 400 error
        res.status(400)
            .send("Widget with ID " + widgetId + " not found");
    }

    function updateWidget(req, res) {
        var widget = req.body;
        var widgetId = req.params.widgetId;

        for(var i in widgets) {
            if(widgets[i]._id === widgetId) {
                widgets[i] = widget;
                res.sendStatus(200);
                return true;
            }
        }
        res.status(400)
            .send("Widget with ID " + widgetId + " not found");
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        var result = [];
        for(var i in widgets) {
            if(widgets[i].pageId === pageId) {
                result.push(widgets[i]);
            }
        }
        res.send(result);
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for(var i in widgets) {
            if(widgets[i]._id === widgetId) {
                widgets.splice(i, 1);
                res.sendStatus(200);
                return true;
            }
        }
        res.status(404)
            .send("Unable to remove widget with ID " + widgetId);
    }
};