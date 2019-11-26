// Filename: map2.js
define('app/map2', [
    "leaflet",
    "helper/logger",
    "jquery",
    "plugins/DynamicMapLayer", "plugins/HomeButton", "plugins/MyZoom", "plugins/Request"
], function (L, logger, $, AgsDynamicLayer, HomeButton, MyZoom, leafletRequest) {
    'use strict';

    //map class
    var map = function (mapDiv1) {
        var self = this;

        // private members
        //var mapDiv = mapDiv1;
        var _points; var _GK50V1_GEOP_F_1; var _GE500_GEO_F_2;

        // public members
        self.map = null;
        self.LID_XHR = null;
        self.LID_POLY_XHR = null;
        self.LID_POLY_XHR2 = null;

        self.setHomeExtent = function () {
            if (self.map !== null) {
                var southWest = L.latLng(46.5, 9.9),
               northEast = L.latLng(48.9, 16.9),
               bounds = L.latLngBounds(southWest, northEast);
                // zoom the map to that bounding box
                self.map.fitBounds(bounds);
            }
        };

        // privileged public method for initializing the map
        self.init = function () {
            var m;
            //// create a map in the "map" div, set the view to a given place and zoom
            //self.map = m = L.map(mapDiv).setView([51.505, -0.09], 13);  

            self.map = m = L.map(mapDiv1, {
                //center: [39.73, -104.99],          
                zoomControl: false,
                attributionControl: false,
                //zoom: 8,
                worldCopyJump: false,
                //positionControl: true,
                zoomAnimation: L.Browser.ie ? false : true
                //crs: L.CRS.EPSG3857
            });
            L.control.attribution({ position: 'bottomright', prefix: false }).addTo(m);
            //L.control.scale({ position: 'bottomleft', metric: true }).addTo(m);

            //var mousePosition = new MousePosition();
            //mousePosition.addTo(m);
            //////L.control.mousePosition().addTo(m);

            // Construct a bounding box for this map that the user cannot                  
            var southWest = L.latLng(46.5, 9.9),
               northEast = L.latLng(48.9, 16.9),
               bounds = L.latLngBounds(southWest, northEast);
            // zoom the map to that bounding box
            m.fitBounds(bounds);
            
            //var home = new L.Control.Home();
            var home = new HomeButton({
                home: {
                    _southWest: {lat: 46.5, lng: 9.9},
                    _northEast: {lat: 48.9, lng: 16.9}
                }
            });
            home.addTo(m);

            //add zoomControl
            var myZoom = new MyZoom();
            myZoom.addTo(m);

            var southWest1 = L.latLng(46.358770, 8.782379);//lowerCorner
            var northEast1 = L.latLng(49.037872, 17.189532);//upperCorner
            var test1 = L.latLngBounds(southWest1, northEast1);
            //var layerUrl = "http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.jpeg";
            var attribution = "www.basemap.at";
            var basemap_0 = L.tileLayer('https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png', {
                attribution: attribution,
                subdomains: ["maps", "maps1", "maps2", "maps3"],
                continuousWorld: false, detectRetina: false, bounds: test1
            });
            basemap_0.addTo(m);

            var protocol = ('https:' === document.location.protocol ? 'https:' : 'http:');

            //gba-layer:
            //var mk500 = new L.tileLayer.wms("http://gisgba.geologie.ac.at/arcgis/services/karten_image/is_md_mk500/ImageServer/WMSServer", {
            var mk500 = new L.tileLayer.wms(protocol + "//gisgba.geologie.ac.at/arcgis/services/image/AT_GBA_MGK500/ImageServer/WMSServer", {
                layers: "0",
                version: "1.3.0",
                format: 'image/png',
                transparent: true,
                opacity: 0.4,
                attribution: 'GBA'
            });
            //gba-layer:
            //var gk50 = new L.tileLayer.wms("http://gisgba.geologie.ac.at/arcgis/services/karten_image/is_md_gk50/ImageServer/WMSServer", {
            var gk50 = new L.tileLayer.wms(protocol + "//gisgba.geologie.ac.at/arcgis/services/image/AT_GBA_GK50/ImageServer/WMSServer", {
               
                layers: "0",
                version: "1.3.0",
                format: 'image/png',
                transparent: true,
                opacity: 0.4,
                attribution: 'GBA'
            });

            _points = new L.geoJson([], {
                //style: style,  
                position: "front",
                pointToLayer: style,
                onEachFeature: onEachFeature            
            });
            _points.addTo(m);
            ////_points.bringToFront();        

            //var url = "http://gisgba.geologie.ac.at/ArcGIS/rest/services/GBATest_V10/MapServer";
            //var url = "http://srv-ags01e.geolba.ac.at/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER/MapServer";
            var url = protocol + "//gisgba.geologie.ac.at/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER/MapServer";
            _GE500_GEO_F_2 = new AgsDynamicLayer(url, {
                opacity: 0.4,
                layers: [2],
                //position: "back",               
                layerDefs: { 2: "GBANR LIKE '1387.0037.0830'" }
            });
            //m.addLayer(_GE500_GEO_F_2);

            //var _layerDefs = {};
            //_layerDefs[1] = "GBANR LIKE '1387.0037.0830'";
            //_layerDefs[2] = "GBANR LIKE '1387.0037.0830'";

            _GK50V1_GEOP_F_1 = new AgsDynamicLayer(url, {
                opacity: 0.4,
                layers: [1],
                //layerDefs: _layerDefs
                layerDefs: { 1: "GBANR LIKE '1387.0037.0830'" }
            });
            //m.addLayer(_GK50V1_GEOP_F_1);

            var polygons = L.layerGroup([_GE500_GEO_F_2, _GK50V1_GEOP_F_1]);
            m.addLayer(polygons);

            //_GK50V1_GEOP_F_1.on("load", function () {
            //    alert("hello");
            //});

            var baseLayers = {
                "MK 500": mk500,
                "GK 50": gk50,
                "BaseMap.at": basemap_0
            };

            var overlayMaps = {
                //"ge500_geo_f": _GE500_GEO_F_2,
                //"gk50v1_geop_f": _GK50V1_GEOP_F_1,  
                "selected points": _points,
                "selected polygons": polygons
            };

            L.control.layers(baseLayers, overlayMaps, {
                //autoZIndex: true,
                collapsed: true
            }).addTo(m);
            //L.control.scale().addTo(m);

        };

        var onEachFeature = function (feature, layer) {
            var popup;
            if (feature.properties) {
                var html = "<ul class='identifyList'>";
                for (var prop in feature.properties) {
                    if (feature.properties.hasOwnProperty(prop)) {
                        var attribute = feature.properties[prop];

                        if (attribute === null || attribute === "Null" || attribute === "" || attribute === "System.Byte[]") {
                            continue;
                        }
                        if (prop === "PROPORTION") {
                            var circle = '<svg height="10" width="8">' +
                                '<circle cx="4" cy="4" r="3" stroke="#CC0000" stroke-width="1" fill="' + _getFillColor(feature) + '" />' +
                                '</svg>';
                            var propTemp = prop.charAt(0).toUpperCase() + prop.substr(1).toLowerCase();
                            html += "<li>" + circle + " <b>" + propTemp + ": </b>" + attribute + "</li>";
                        }
                        else {
                            html += "<li>" + attribute + "</li>";
                        }
                    }
                }
                html += "</ul>";
                popup = layer.bindPopup(html);
            }
            (function (layer, properties, popup) {
                // Create a mouseover event
                layer.on("click", function (e) {
                    highlightFeature(e);
                    L.DomEvent.stopPropagation(e);
                });

                popup.on("popupclose", function (e) {
                    resetHighlight(e);
                    L.DomEvent.stopPropagation(e);
                });

                // Close the "anonymous" wrapper function, and call it while passing
                // in the variables necessary to make the events work the way we want.
            })(layer, feature.properties, popup);
        };

        var highlightFeature = function (e) {
            var layer = e.target;

            var highlightStyle = {
                "color": "#2262CC",
                "weight": 7,
                "opacity": 1
            };
            layer.setStyle(highlightStyle);

            //if (!L.Browser.ie && !L.Browser.opera) {
            //    layer.bringToFront();
            //}
        };

        var resetHighlight = function (e) {
            //geojson.resetStyle(e.target);
            var layer = e.target;
            var feature = e.target.feature;

            var geojsonMarkerOptions = {
                radius: 3,
                color: "#CC0000",//strokeColor: "#CC0000"
                weight: 1,//strokeWidth: 1
                opacity: 1,//strokeOpacity: 1
                fillColor: _getFillColor(feature),
                fillOpacity: _getFillOpacity(feature)
            };

            layer.setStyle(geojsonMarkerOptions);
        };

        var style = function (feature, latlng) {
            //var fillcolor = _getFillColor(feature);
            //var opacity = _getFillOpacity(feature);

            //if ("sn" == feature.properties.name) {
            var geojsonMarkerOptions = {
                radius: 3,
                color: "#CC0000",//strokeColor: "#CC0000"
                weight: 1,//strokeWidth: 1
                opacity: 1,//strokeOpacity: 1
                fillColor: _getFillColor(feature),
                fillOpacity: _getFillOpacity(feature)
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        };

        var _getFillColor = function (feature) {
            if (feature.properties.PROPORTION === "all" || feature.properties.PROPORTION === "most abundant") {
                return "#FF4444";//hellrot
            }
                //if not lithology
            else if (feature.properties.PROPORTION === null || feature.properties.PROPORTION === undefined) {
                return "#FF4444";//hellrot 
            }
            else {//e.g. present                       
                return "#FFFFFF";//weiß
            }
        };

        var _getFillOpacity = function (feature) {
            if (feature.properties.PROPORTION === "all" || feature.properties.PROPORTION === "most abundant") {
                return 0.80;//hellrot
            }
                //if not lithology
            else if (feature.properties.PROPORTION === null || feature.properties.PROPORTION === undefined) {
                return 0.80;//hellrot
            }
            else {//e.g. present                       
                return 0.00;//weiß
            }
        };

        self.showL_ID = function (list, isLithology, successCallback, failureCallback) {

            ////_clearMapFeatures();
            _points.clearLayers(); // inherited from LayerGroup

            if (self.LID_XHR !== null) {
                self.LID_XHR.abort();
            }
            if (self.LID_POLY_XHR !== null) {
                self.LID_POLY_XHR.abort();
            }
            if (self.LID_POLY_XHR2 !== null) {
                self.LID_POLY_XHR2.abort();
            }

            if (list.length === 0) {
                logger.info("No filters!!!", true);
                if (typeof failureCallback !== "undefined") {
                    failureCallback();
                }
                return;
            }

            var idArray = $.map(list, function (obj) {
                return obj.l_id;
            });
            var requestList = "GBANR IN ('" + idArray.join("','") + "')";

            //var point_idArray = idArray.slice(0, 160);
            //var point_requestList = "GBANR IN ('" + point_idArray.join("','") + "')";

            if (idArray.length > 160) {
                _getHyd(list, requestList)
                .done(function () {
                    if (typeof successCallback !== "undefined") {
                        successCallback();
                    }
                })
                .fail(function () {
                    if (typeof failureCallback !== "undefined") {
                        failureCallback();
                    }
                });
            }
            else {
                //$.when(_getPoints2(list, point_requestList, isLithology))
                $.when(_getHyd(list, requestList), _getPoints2(list, requestList, isLithology))
                   .done(function () {
                       if (typeof successCallback !== "undefined") {
                           //_points.bringToFront();
                           successCallback();
                       }
                   })
                   .fail(function () {
                       if (typeof failureCallback !== "undefined") {
                           failureCallback();
                       }
                   });
            }


        };

        var _getHyd = function (list, requestList) {
            // 1) create the jQuery Deferred object that will be used
            var deferred = $.Deferred();


            //var _layerDefs = {};
            //_layerDefs[1] = requestList;
            //_layerDefs[2] = requestList;
            //_GK50V1_GEOP_F_1.setLayerDefs(_layerDefs);

            _GE500_GEO_F_2.setLayerDefs({ 2: requestList });
            _GK50V1_GEOP_F_1.setLayerDefs({ 1: requestList });
            //_test1.setLayerDefs({ "1": "GBANR IN ('1289.3','1289.32')", "2": "GBANR IN ('1289.3','1289.32')" });

            deferred.resolve("success");

            // Return the Promise so caller can't change the Deferred
            return deferred.promise();
        };

        var _getPoints2 = function (list, requestList, isLithology) {
            // 1) create the jQuery Deferred object that will be used
            var deferred = $.Deferred();
            var protocol = ('https:' === document.location.protocol ? 'https:' : 'http:');
         
            //leafletRequest.request("http://gisgba.geologie.ac.at/ArcGIS/rest/services/GBATest_V10/MapServer/0/query",            
            leafletRequest.request(protocol + "//gisgba.geologie.ac.at/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER/MapServer/0/query",
            //leafletRequest.request("http://193.170.253.69/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER_31287/MapServer/0/query",
               {
                   f: "json", inSR: 31287,
                   outSR: 4326,
                   //outSR: {"wkt" : "GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137,298.257223563]],PRIMEM[\"Greenwich\",0],UNIT[\"Degree\",0.017453292519943295]]"},
                   geometryType: "esriGeometryMultipoint", geometryPrecision: 15, where: requestList, outFields: "C01.GBA.DATAVIEWER.GBANR,C01.gba.GE_GeologicFeature.LEGTEXT"
               },
                function (error, data) {
                    if (error) {
                        if (error.message !== "abort") {
                            // probably nothing to do here: the request was aborted as a response to subsequent user action
                            logger.error(error.message + ": points couldn't be loaded222", true);
                        }
                        deferred.reject("point request error: " + error.message);
                    }
                    else {
                        if (data.error) {
                            logger.error(data.error.details[0], true);
                            deferred.reject(data.error.details[0]);
                        }
                        else {
                            if (data.features.length > 0) {

                                ////Koordinatenversatz dazurechnen:
                                //var xVersatz = 0.00098;
                                //var yVersatz = 0.00060;
                                for (var a = 0; a < data.features.length; a++) {
                                    var feature = data.features[a];
                                    for (var b = 0; b < feature.geometry.points.length; b++) {
                                        var point = feature.geometry.points[b];
                                        //point[0] = point[0] - xVersatz;
                                        //point[1] = point[1] - yVersatz;

                                    }
                                }



                                //nur wenn dir uri lithology beinhaltet, dann das Attribut "PRPORTION" hinzufügen
                                if (isLithology === true) {
                                    for (var i = 0; i < data.features.length; i++) {
                                        var feature = data.features[i];
                                        //var nr = feature.attributes.GBANR;                                     
                                        var nr = feature.attributes["C01.GBA.gk50v1_DATAVIEWER_P.GBANR"];
                                        var test = $.grep(list, function (lidItem) { return lidItem.l_id === nr; });
                                        if (test.length > 0) {
                                            feature.attributes.PROPORTION = test[0].proportion;
                                        }
                                    }
                                }
                                _addEsriFeatures(data, 0);                                
                                deferred.resolve(data);
                            }
                            else {
                                logger.warning("Correct request, but the rest service responds no point features.", true);
                                deferred.reject("Correct request, but the rest service responds no point features.");
                            }
                        }
                    }
                }, this);

            // Return the Promise so caller can't change the Deferred
            return deferred.promise();

        };

        //var _getPoints = function (list, requestList, isLithology) {
        //    // 1) create the jQuery Deferred object that will be used
        //    var deferred = $.Deferred();

        //    self.LID_XHR = $.ajax({
        //        type: "GET",
        //        url: "http://gisgba.geologie.ac.at/ArcGIS/rest/services/GBATest_V10/MapServer/0/query",
        //        data: { f: "json", outSR: 4326, where: requestList, outFields: "C01.GBA.gk50v1_DATAVIEWER_P.GBANR,C01.gba.GE_GeologicFeature.LEGTEXT" },
        //        dataType: "jsonp",               
        //        success: function (data) {
        //            if (data.error) {
        //                logger.error(data.error.details[0], true);
        //                deferred.reject(data.error.details[0]);
        //            }
        //            else {
        //                if (data.features.length > 0) {

        //                    //nur wenn dir uri lithology beinhaltet, dann das Attribut "PRPORTION" hinzufügen
        //                    if (isLithology === true) {
        //                        for (var i = 0; i < data.features.length; i++) {
        //                            var feature = data.features[i];
        //                            //var nr = feature.attributes.GBANR;                                     
        //                            var nr = feature.attributes["C01.GBA.gk50v1_DATAVIEWER_P.GBANR"];
        //                            var test = $.grep(list, function (lidItem) { return lidItem.l_id === nr; });
        //                            if (test.length > 0) {
        //                                feature.attributes.PROPORTION = test[0].proportion;
        //                            }
        //                        }
        //                    }
        //                    _addEsriFeatures(data, 0);
        //                    deferred.resolve(data);
        //                }
        //                else {
        //                    logger.warning("Correct request, but the rest service responds no point features.", true);
        //                    deferred.reject("Correct request, but the rest service responds no point features.");
        //                }
        //            }

        //        },
        //        error: function (jqXHR, textStatus, errorThrown) {
        //            if (jqXHR.statusText !== "abort") {
        //                // probably nothing to do here: the request was aborted as a response to subsequent user action
        //                logger.error(jqXHR.statusText + ": points couldn't be loaded", true);
        //            }                    
        //            deferred.reject("point request error: " + errorThrown);

        //        }
        //    });

        //    // Return the Promise so caller can't change the Deferred
        //    return deferred.promise();

        //};

        var _addEsriFeatures = function (esri) {             
            var a = toGeoJSON(esri);
            if (a === null) return;
            _points.addData(a);            
        };

        var toGeoJSON = function (data, cb) {
            var outPut = {
                "type": "FeatureCollection",
                "features": []
            };
            var fl = data.features.length;
            var i = 0;
            while (fl > i) {
                var ft = data.features[i];
                /* as only ESRI based products care if all the features are the same type of geometry, check for geometry type at a feature level*/
                var outFT = {
                    "type": "Feature",
                    "properties": ft.attributes
                };
                if (ft.geometry.x) {
                    //check if it's a point
                    outFT.geometry = point(ft.geometry);
                } else if (ft.geometry.points) {
                    //check if it is a multipoint
                    outFT.geometry = points(ft.geometry);
                } else if (ft.geometry.paths) {
                    //check if a line (or "ARC" in ESRI terms)
                    outFT.geometry = line(ft.geometry);
                } else if (ft.geometry.rings) {
                    //check if a poly.
                    outFT.geometry = poly(ft.geometry);
                }

                outPut.features.push(outFT);
                i++;
            }
            function point(geometry) {
                //this one is easy
                return { "type": "Point", "coordinates": [geometry.x, geometry.y] };
            }
            function points(geometry) {
                //checks if the multipoint only has one point, if so exports as point instead
                if (geometry.points.length === 1) {
                    return { "type": "Point", "coordinates": geometry.points[0] };
                } else {
                    return { "type": "MultiPoint", "coordinates": geometry.points };
                }
            }
            function line(geometry) {
                //checks if their are multiple paths or just one
                if (geometry.paths.length === 1) {
                    return { "type": "LineString", "coordinates": geometry.paths[0] };
                } else {
                    return { "type": "MultiLineString", "coordinates": geometry.paths };
                }
            }
            function poly(geometry) {
                //first we check for some easy cases, like if their is only one ring
                if (geometry.rings.length === 1) {
                    return { "type": "Polygon", "coordinates": geometry.rings };
                } else {
                    /*if it isn't that easy then we have to start checking ring direction, basically the ring goes clockwise its part of the polygon, if it goes counterclockwise it is a hole in the polygon, but geojson does it by haveing an array with the first element be the polygons and the next elements being holes in it*/
                    var ccc = dP(geometry.rings);
                    var d = ccc[0];
                    var dd = ccc[1];
                    var r = [];
                    if (dd.length === 0) {
                        /*if their are no holes we don't need to worry about this, but do need to stuck each ring inside its own array*/
                        var l2 = d.length;
                        var i3 = 0;
                        while (l2 > i3) {
                            r.push([d[i3]]);
                        }
                        return { "type": "MultiPolygon", "coordinates": r };
                    } else if (d.length === 1) {
                        /*if their is only one clockwise ring then we know all holes are in that poly*/
                        dd.unshift(d[0]);
                        return { "type": "Polygon", "coordinates": dd };

                    } else {
                        /*if their are multiple rings and holes we have no way of knowing which belong to which without looking at it specially, so just dump the coordinates and add  a hole field, this may cause errors*/
                        return { "type": "MultiPolygon", "coordinates": d, "holes": dd };
                    }
                }
            }
            function dP(a) {
                //returns an array of 2 arrays, the first being all the clockwise ones, the second counter clockwise
                var d = [];
                var dd = [];
                var l = a.length;
                var ii = 0;
                while (l > ii) {
                    if (c(a[ii])) {
                        d.push(a[ii]);
                    } else {
                        dd.push(a[ii]);
                    }
                    ii++;
                }
                return [d, dd];
            }
            function c(a) {
                //return true if clockwise
                var l = a.length - 1;
                var i = 0;
                var o = 0;

                while (l > i) {
                    o += a[i][0] * a[i + 1][1] - a[i + 1][0] * a[i][1];

                    i++;
                }
                return o <= 0;
            }
            if (cb) {
                cb(outPut);
            } else {
                return outPut;
            }
        };

    };//end of map class

    return map;
});