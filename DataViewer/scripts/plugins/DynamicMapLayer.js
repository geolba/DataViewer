define('plugins/DynamicMapLayer',[
    "leaflet",   
    "plugins/Request"
], 
function (
   L, Request
) {

    var DynamicMapLayer = L.Class.extend({
        includes: L.Mixin.Events,       
        options: { updateInterval: 150, layers: false, layerDefs: false, timeOptions: false, format: "png24", transparent: true, opacity: 1, position: "front"},
       
        //constructor:
        initialize: function (url, options) {
            options = options || {};
            options.url = this._cleanUrl(url);            
            L.Util.setOptions(this, options);
        },
       

        /*public properties that modify the map*/
        getLayers: function () { return this.options.layers; },
        setLayers: function (/*string*/layers) {
            //this.options.layers = layers;
            //this._updateLayer();
            return this.options.layers = layers, this._update();
            //this;
        },
        getLayerDefs: function () { return this.options.layerDefs; },
        setLayerDefs: function (n) {
            this.options.layerDefs = n;
            this._update();
        },
     
        bringToFront: function () {
            this.options.position = "front";
            this._currentImage && this._currentImage.bringToFront();
          
        },
        bringToBack: function () {
            this.options.position = "back";
            this._currentImage && this._currentImage.bringToBack();          
        },
        reset: function () {
            this._reset();
        }, 
        show: function () {
            this._image.style.display = 'block';
            this._image.style.visibility = 'visible';
        },
        hide: function () {
            this._image.style.display = 'none';
        },
        isVisible: function () {
            return this._image.style.display === 'block';
        },
        onAdd: function (map) {
            //this._map = map;
            //this._reset();
            //map.on('viewreset', this._reset, this);
            //map.on('moveend', this._moveEnd, this);
            //map.on('zoomend', this._zoomEnd, this);
            if (this._map = map, this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this),
            map.options.crs && map.options.crs.code) {
                var i = map.options.crs.code.split(":")[1]; this.options.bboxSR = i; this.options.imageSR = i;
            }
            map.on("moveend", this._update, this);
            this._currentImage && this._currentImage._bounds.equals(this._map.getBounds()) ? map.addLayer(this._currentImage) : this._currentImage && (this._map.removeLayer(this._currentImage),
            this._currentImage = null);
            this._update();
            //if (this._popup) {
            //    this._map.on("click", this._getPopupData, this);
            //    this._map.on("dblclick", this._resetPopupState, this);
            //}
        },
        onRemove: function () {
            this._currentImage && this._map.removeLayer(this._currentImage);
            this._popup && (this._map.off("click", this._getPopupData, this),
            this._map.off("dblclick", this._resetPopupState, this));
            this._map.off("moveend", this._update, this);
            this._map = null;
        },
        addTo: function (map) {
            return map.addLayer(this);            
        },

        /* private functions */
        _cleanUrl: function (n) {
            return n = n.replace(/\s\s*/g, ""),
            "/" !== n[n.length - 1] && (n += "/"),
            n;
        },
        _buildExportParams: function () {
            var t = this._map.getBounds(),
            i = this._map.getSize(),
            r = this._map.options.crs.project(t._northEast),
            u = this._map.options.crs.project(t._southWest),
            n = {
                bbox: [u.x, u.y, r.x, r.y].join(","),
                size: i.x + "," + i.y, dpi: 96, format: this.options.format, transparent: this.options.transparent, bboxSR: this.options.bboxSR, imageSR: this.options.imageSR
            };
            return this.options.layers && (n.layers = "show:" + this.options.layers.join(",")),
            this.options.layerDefs && (n.layerDefs = JSON.stringify(this.options.layerDefs)),
            this.options.timeOptions && (n.timeOptions = JSON.stringify(this.options.timeOptions)),
            this.options.from && this.options.to && (n.time = this.options.from.valueOf() + "," + this.options.to.valueOf()),
            //this._service.options.token && (n.token = this._service.options.token),
            n;
        },
        _requestExport: function (tu, boundingBox) { 
            //if ("json" === this.options.f) {
            //    this._service.get("export", t, function (n, t) {
            //        this._renderImage(t.href, boundingBox);
            //    }, this);
            //}
            //else {
            //    t.f = "image";
            //    this._renderImage(this.options.url + "export" + L.Util.getParamString(t), boundingBox);
            //}

            //var browserSupportCors = window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest();
            //var requestLength = (this.options.url + "export" + '?' + L.Util.getParamString(t)).length;

            //if (requestLength <= 2000 && browserSupportCors) {
            //    t.f = "image";
            //    this._renderImage(this.options.url + "export" + L.Util.getParamString(t), boundingBox);                
            //}
            ////request via POST
            //else if (requestLength > 2000 && browserSupportCors) {
            //    this._postQueryArcGIS(t, boundingBox);
            //}
            ////request via JSONP
            //else if (requestLength <= 2000 && !browserSupportCors) {
            //    this._jsonpQueryArcGIS(t, boundingBox);
            //}
            //// request is longer then 2000 characters and the browser does not support CORS, log a warning	
            //else {
            //    if (console && console.warn) {
            //        console.warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
            //        return;
            //    }
            //}

            Request.request(this.options.url + "export",
                tu,
                //{
                //    f: "json", bboxSR: 3857, bbox: "835303.8451004061,5717489.715731184,2147574.746700312,6402365.489166364",
                //    transparent: true, layers: "show:1",
                //    layerdefs: t.layerDefs
                //},
                function (error, response) {
                    if (error) {
                        console.log(error.message);                       
                    } else {
                        //console.log(response.href);                       
                        this._renderImage(response.href, boundingBox);
                    }
            }, this);

        },

        _jsonpQueryArcGIS: function (t, boundingBox) {

            //var deferred = $.Deferred();
            var params = $.extend(t, { f: "json" });

            var xhr = $.ajax({
                url: this.options.url + "export",
                type: "get",              
                dataType: "jsonp",
                //dataType: 'text',
                //contentType: "application/x-www-form-urlencoded",
                context: this,
                headers: {
                    "accept": "image/png"
                },
                data: params
                //data: {
                //    f: "pjson", bboxSR: 3857, bbox: "835303.8451004061,5717489.715731184,2147574.746700312,6402365.489166364",
                //    layers: "show:1", transparent: true,
                //    layerdefs: t.layerDefs
                //    //layerdefs:{"1":"GBANR IN ('1289.3','1289.4','1289.32','1289.62','1289.35','1387.0055.0030','1387.0055.0031','1387.0055.0032','1387.0055.0033','1387.0055.0037','1387.0055.0038','1387.0055.0069','1387.0055.0045','1387.0055.0048','1387.0055.0052','1387.0055.0053','1387.0055.0054','1387.0055.0058','1387.0055.0059','1378.0055.0958','1387.0055.0061','1387.0055.0062','1387.0055.0064','1378.0055.0959','1378.0055.0969','1387.0055.0073','1397.0055.0074','1378.0055.0904','1387.0055.0078','1387.0055.0087','1387.0055.0089','1387.0055.0090','1387.0055.0102','1387.0055.0104','1387.0055.0105','1378.0055.0323','1387.0055.0107','1387.0055.0108','1387.0055.0114','1387.0047.0033','1387.0047.0034','1387.0047.0035','1387.0047.0036','1387.0047.0037','1387.0047.0038','1387.0047.0039','1387.0047.0041','1387.0049.0043','1387.0049.0044','1387.0049.0045','1387.0049.0047','1387.0049.0048','1387.0049.0049','1387.0059.0020','1387.0059.0021','1387.0060.0020','1387.0060.0022','1387.0061.0015','1387.0061.0016','1387.0061.0017','1387.0076.0017','1387.0076.0018','1387.0076.0019','1387.0076.0021','1387.0076.0023','1387.0076.0024','1387.0076.0025','1387.0076.0026','1387.0076.0028','1387.0076.0029','1387.0076.0032','1387.0076.0033','1387.0076.0035','1387.0076.0048','1387.0076.0049','1387.0076.0054','1387.0076.0059','1387.0076.0062','1387.0079.0011','1387.0079.0012','1387.0079.0013','1387.0077.0023','1387.0077.0024','1387.0077.0028','1387.0077.0029','1387.0077.0034','1387.0077.0035','1387.0078.0018','1387.0078.0019','1387.0078.0024','1387.0078.0028','1387.0078.0029','1387.0038.0018','1387.0038.0020','1387.0038.0021','1387.0038.0022','1387.0038.0024','1387.0033.0016','1387.0033.0017','1387.0034.0014','1387.0038.0026','1387.0038.0028','1387.0038.0029','1387.0037.0017','1387.0037.0018','1387.0037.0019','1387.0037.0020')"}
                //}    
            });

            xhr.done(function (n) {
                ////deferred.resolve(n);      
                this._renderImage(n.href, boundingBox);
            }).fail(function () {
                // This shouldn't occur, but it's defined just in case               
                //deferred.reject(error);
            });

            //return deferred.promise();
        },

        _postQueryArcGIS: function (t, boundingBox) {
          
            //var deferred = $.Deferred();
            var params = $.extend(t, { f: "json" });

            var xhr = $.ajax({
                url: this.options.url + "export",
                type: "post",
                crossDomain: true,
                dataType: "json",             
                contentType: "application/x-www-form-urlencoded",             
                context: this,
                headers: {
                    "accept": "image/png"                  
                },
                data:params              
                //data: {
                //    f: "pjson", bboxSR: 3857, bbox: "835303.8451004061,5717489.715731184,2147574.746700312,6402365.489166364",
                //    layers: "show:1", transparent: true,
                //    layerdefs: t.layerDefs
                //    //layerdefs:{"1":"GBANR IN ('1289.3','1289.4','1289.32','1289.62','1289.35','1387.0055.0030','1387.0055.0031','1387.0055.0032','1387.0055.0033','1387.0055.0037','1387.0055.0038','1387.0055.0069','1387.0055.0045','1387.0055.0048','1387.0055.0052','1387.0055.0053','1387.0055.0054','1387.0055.0058','1387.0055.0059','1378.0055.0958','1387.0055.0061','1387.0055.0062','1387.0055.0064','1378.0055.0959','1378.0055.0969','1387.0055.0073','1397.0055.0074','1378.0055.0904','1387.0055.0078','1387.0055.0087','1387.0055.0089','1387.0055.0090','1387.0055.0102','1387.0055.0104','1387.0055.0105','1378.0055.0323','1387.0055.0107','1387.0055.0108','1387.0055.0114','1387.0047.0033','1387.0047.0034','1387.0047.0035','1387.0047.0036','1387.0047.0037','1387.0047.0038','1387.0047.0039','1387.0047.0041','1387.0049.0043','1387.0049.0044','1387.0049.0045','1387.0049.0047','1387.0049.0048','1387.0049.0049','1387.0059.0020','1387.0059.0021','1387.0060.0020','1387.0060.0022','1387.0061.0015','1387.0061.0016','1387.0061.0017','1387.0076.0017','1387.0076.0018','1387.0076.0019','1387.0076.0021','1387.0076.0023','1387.0076.0024','1387.0076.0025','1387.0076.0026','1387.0076.0028','1387.0076.0029','1387.0076.0032','1387.0076.0033','1387.0076.0035','1387.0076.0048','1387.0076.0049','1387.0076.0054','1387.0076.0059','1387.0076.0062','1387.0079.0011','1387.0079.0012','1387.0079.0013','1387.0077.0023','1387.0077.0024','1387.0077.0028','1387.0077.0029','1387.0077.0034','1387.0077.0035','1387.0078.0018','1387.0078.0019','1387.0078.0024','1387.0078.0028','1387.0078.0029','1387.0038.0018','1387.0038.0020','1387.0038.0021','1387.0038.0022','1387.0038.0024','1387.0033.0016','1387.0033.0017','1387.0034.0014','1387.0038.0026','1387.0038.0028','1387.0038.0029','1387.0037.0017','1387.0037.0018','1387.0037.0019','1387.0037.0020')"}
                //}    
            });     

            xhr.done(function (n) {              
                ////deferred.resolve(n);      
                this._renderImage(n.href, boundingBox);
            }).fail(function () {
                // This shouldn't occur, but it's defined just in case               
                //deferred.reject( error);
            });

            //return deferred.promise();
        },

        _renderImage: function (imageUrl, imageBounds) {
            if (this._map) {              
                var r = new L.ImageOverlay(imageUrl, imageBounds, { opacity: 0 }).addTo(this._map);
                r.once("load", function (n) {
                    var r = n.target;
                    var t = this._currentImage;
                    if (r._bounds.equals(imageBounds)) {
                        this._currentImage = r;
                        if ("front" === this.options.position) {
                            this.bringToFront();
                        } else {
                            this.bringToBack();
                        }
                        this._map && this._currentImage._map ? this._currentImage.setOpacity(this.options.opacity) : this._currentImage._map.removeLayer(this._currentImage),
                        t && this._map && this._map.removeLayer(t),
                        t && t._map && t._map.removeLayer(t);
                    }
                    else {
                        this._map.removeLayer(r);
                    }
                    this.fire("load", { bounds: imageBounds });

                },
                this);
                this.fire("loading", { bounds: imageBounds });
            }
        },
        _update: function () {
            var n, t, i;
            this._map && (n = this._map.getZoom(),
            t = this._map.getBounds(),
            this._animatingZoom || this._map._panTransition && this._map._panTransition._inProgress || n > this.options.maxZoom || n < this.options.minZoom || (i = this._buildExportParams(),
            this._requestExport(i, t)));
        },
        _reset: function () {
            if (this._image) {
                this._map.getPanes().mapPane.removeChild(this._image);
            }
            this._initImage();
            this._updateLayer();
        }

    });
    return DynamicMapLayer;

});