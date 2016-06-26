var mongoose = require("mongoose");
var constants = require("../../constants/schemaConstants");

module.exports = function () {
    var WidgetSchema = require("./widget.schema.server.js")();
    var Widget = mongoose.model("Widget", WidgetSchema);

    function reorderWidget(startOrder, endOrder, pageId) {
        var start = parseInt(startOrder);
        var end = parseInt(endOrder);
        return Widget
            .find({_page: pageId}, function (err, widgets) {
                widgets.forEach(function (widget) {
                    if (start < end) {
                        if (widget.order > start && widget.order <= end) {
                            widget.order--;
                            widget.save();
                        }
                        else if (widget.order === start) {
                            widget.order = end;
                            widget.save();
                        }
                    }
                    else {
                        if (widget.order >= end && widget.order < start) {
                            widget.order++;
                            widget.save();
                        }
                        else if (widget.order === start) {
                            widget.order = end;
                            widget.save();
                        }
                    }
                })
            });
    }

    function createWidget(pageId, widget) {
        widget._page = pageId;
        return Widget.create(widget);
    }

    function findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId});
    }

    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        return Widget.update(
            {_id: widgetId},
            {
                $set: {
                    name: widget.name || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    text: widget.text || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    placeholder: widget.placeholder || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    description: widget.description || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    url: widget.url || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    width: widget.width || constants.DEFAULT_WIDGET_WIDTH,
                    height: widget.height || constants.DEFAULT_WIDGET_HEIGHT,
                    rows: widget.rows || constants.DEFAULT_WIDGET_ROWS,
                    size: widget.size || constants.DEFAULT_WIDGET_SIZE,
                    class: widget.class || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    icon: widget.icon || constants.DEFAULT_WIDGET_PLACEHOLDER,
                    deletable: widget.deletable || false,
                    formatted: widget.formatted || false
                }
            }
        );
    }

    function deleteWidget(widgetId) {
        return Widget.remove({_id: widgetId});
    }

    return {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };

};