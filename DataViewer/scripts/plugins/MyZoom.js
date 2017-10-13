﻿define('plugins/MyZoom',[
    "leaflet"  
], 
function (
   L
) {
    var MyZoom = L.Control.extend({

        options: {
            position: 'topright',
            zoomInText: '+',
            zoomInTitle: 'Zoom in',
            zoomOutText: '-',
            zoomOutTitle: 'Zoom out'
        },

        onAdd: function (map) {
            //var zoomName = 'leaflet-control-zoom',
            var className = 'my-leaflet-control-zoom';
            var container = L.DomUtil.create('div', className);
            //container = L.DomUtil.create('div', zoomName + ' leaflet-bar');

            this._map = map;

            this._zoomInButton = this._createButton(
                    //this.options.zoomInText, this.options.zoomInTitle,
                    "", this.options.zoomInTitle,
                    className + '-in', container, this._zoomIn, this);
            this._zoomOutButton = this._createButton(
                    //this.options.zoomOutText, this.options.zoomOutTitle,
                    "", this.options.zoomOutTitle,
                    className + '-out', container, this._zoomOut, this);

            this._updateDisabled();
            map.on('zoomend zoomlevelschange', this._updateDisabled, this);

            return container;
        },

        onRemove: function (map) {
            map.off('zoomend zoomlevelschange', this._updateDisabled, this);
        },

        _zoomIn: function (e) {
            this._map.zoomIn(e.shiftKey ? 3 : 1);
        },

        _zoomOut: function (e) {
            this._map.zoomOut(e.shiftKey ? 3 : 1);
        },

        _createButton: function (html, title, className, container, fn, context) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = "<span>" + html + "</span>";
            link.href = '#';
            link.title = title;

            var stop = L.DomEvent.stopPropagation;

            L.DomEvent
                .on(link, 'click', stop)
                .on(link, 'mousedown', stop)
                .on(link, 'dblclick', stop)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', fn, context)
                .on(link, 'click', this._refocusOnMap, context);

            return link;
        },

        _updateDisabled: function () {
            var map = this._map,
                className = 'leaflet-disabled';

            L.DomUtil.removeClass(this._zoomInButton, className);
            L.DomUtil.removeClass(this._zoomOutButton, className);

            if (map._zoom === map.getMinZoom()) {
                L.DomUtil.addClass(this._zoomOutButton, className);
            }
            if (map._zoom === map.getMaxZoom()) {
                L.DomUtil.addClass(this._zoomInButton, className);
            }
        }

    });

    return MyZoom;
});