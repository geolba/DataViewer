/*
 * DataViewer library
 * Copyright 2014-2017
 * Authors: Arno Kaimbacher
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 */

require.config({
    //baseUrl: '../scripts',
    paths: {
        //jquery: 'jquery-3.1.1',
        'jquery': 'jquery',
        //toastr: 'toastr',
        toastr: 'toastr',
        //ko: 'knockout-3.4.0',
        ko: 'ko',
        //leaflet: 'leaflet-0.7.3',
        leaflet: 'leaflet',
        //text: "text",
        text: "text",
        i18n: "i18n"
    },
    //locale: "de",// _urlParam("lang", window.location.href)? _urlParam("lang", window.location.href) : "en", // getLocale(),
    urlArgs: "version=release2",
    shim: {
        //jquery: { exports: "$" }, //jquery 1.7.x understands define; no shim needed.
        //'ko': { deps: ['jquery'], exports: 'ko' }, //ko 2.1 understands define; no shim needed
        toastr: { deps: ['jquery'], exports: 'toastr' },
        leaflet: {
            exports: 'L'
        }
    }
});
function _urlParam(parameter, url) {
    var results = new RegExp('[\\?&]' + parameter + '=([^&#]*)').exec(url);
    if (results === null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}
requirejs.s.contexts._.config.locale = _urlParam("lang", window.location.href) ? _urlParam("lang", window.location.href) : "en";

require(['main']);