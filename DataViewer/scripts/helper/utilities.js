// Filename: utilities.js -> static class
define('helper/utilities',
    ["jquery", "i18n!nls/template"
], function ($, myLabels) {

    //constant static variable
    var LOADING_ID_PREFIX = "loading__";

    var setLoading = function (elemID) {
        //debug("setting loading " + elemID);

        var loadingDivID = LOADING_ID_PREFIX + elemID;

        var existingDiv = $("#" + loadingDivID);

        // if the loading div for given element already exists,
        // increment the lock attribute value (or create the attribute,
        // if not exists)
        if (existingDiv.length > 0) {
            if (typeof existingDiv.attr("lock") === "undefined") {
                existingDiv.attr("lock", 1);
            } else {
                existingDiv.attr("lock", parseInt(existingDiv.attr("lock")) + 1);
            }
        }
            // otherwise, create the div and append it to body
        else {
            // construct the div from markup
            var loadingDiv = $("<div id=\"" + loadingDivID + "\" class=\"loading\"></div>");
            var loadingDivContent = $("<div class=\"loading-content\">" + myLabels.viewer.messages.waitMessage + "</div>");
            loadingDiv.append(loadingDivContent);

            // get the element to be covered with the loading div...
            var targetElement = $("#" + elemID);

            // ... and get its proportions
            var offset = targetElement.offset();
            var width = targetElement.outerWidth();
            var height = targetElement.outerHeight();

            // make the div fit the target element
            loadingDiv.css({
                "left": offset.left,
                "top": offset.top,
                "width": width + "px",
                "height": height + "px"
            });

            // make the text appear in the middle of the loading div
            loadingDivContent.css({
                "line-height": height + "px"
            });


            $("body").append(loadingDiv);
        }
    };

    var unsetLoading = function (elemID) {
        //debug("unsetting loading " + elemID);

        var loadingDivElement = $("#" + LOADING_ID_PREFIX + elemID);

        var lock = loadingDivElement.attr("lock");

        if (typeof lock === "undefined") {
            loadingDivElement.remove();
        } else {
            var lockValue = parseInt(lock);

            if (lockValue > 1) {
                loadingDivElement.attr("lock", lockValue - 1);
            } else {
                loadingDivElement.removeAttr("lock");
            }
        }
    };    

    return {
        setLoading: setLoading,
        unsetLoading: unsetLoading
    };

});