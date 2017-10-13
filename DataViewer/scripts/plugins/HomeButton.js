define('plugins/HomeButton',[
    "leaflet", "jquery", "helper/logger"
], 
function (L, $, logger) {
    'use strict';
    var HomeButton = L.Control.extend({

        // default options
        _options: { 
            position: 'topright',
            homeText: '+',
            homeTitle: 'Home Extent',
            visible: true
        },

        //constructor:
        initialize: function (options) {
            // mix in settings and defaults
            L.Util.extend(this._options, options);

            // properties     
            this.map = {};
            this.visible = this._options.visible;
            this.home = this._options.home;
        },
              
        // happens after added to map
        onAdd: function (map) {
            if (!this.map) {
                //self.destroy();
                logger.warning('HomeButton::map required', true);                
                return;
            }          
            this.map = map;
            //this._options.home.initialZoom = map.options.zoom;
            //this.options.home.initialCenter = map.options.center;

            var className = 'leaflet-control-home';
            // Create sidebar container
            var container = this._container = L.DomUtil.create('div', className); 
            //if (this._options.home) {
            this._homeButton = this._createButton(
                    //this.options.zoomInText, this.options.zoomInTitle,
                    "", this._options.homeTitle,
                    className + '-do', container, this._goHome, this);
            this._init();
            //}

            //this._updateDisabled();
            //map.on('zoomend zoomlevelschange', this._updateDisabled, this);
            return container;
        },
       
        _init: function () {
            // show or hide widget
            this._visible();

            //// if no extent set, set extent to map extent
            if (!this.home) {
                this.home = this.map.getBounds();                
            }

            //// widget is now loaded
            this.loaded = true;         
        },

        _visible : function () {
            if (this.visible === true) {
                //domStyle.set(self.domNode, 'display', 'block');
                $(this._container).css('display', 'block');
                //$('#test55').show();
            }
            else {
                //domStyle.set(self.domNode, 'display', 'none');
                $(this._container).css('display', 'none');
                //$('#test55').hide();
            }
        },

        _goHome: function () {
            //this._map.zoomIn(e.shiftKey ? 3 : 1);
            this._exitFired = false;
            //this.map.setView(this.options.home.initialCenter, this.options.home.initialZoom);
            var bounds = L.latLngBounds(this._options.home._southWest, this._options.home._northEast);
            this.map.fitBounds(bounds);
        },


        _createButton: function (html, title, className, container, fn, context) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = title;           

            var stop = L.DomEvent.stopPropagation;

            L.DomEvent
                .on(link, 'click', stop)
                .on(link, 'mousedown', stop)
                .on(link, 'dblclick', stop)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', fn, context);
            //.on(link, 'click', this._refocusOnMap, context);

            return link;
        }

    });

    return HomeButton;
});