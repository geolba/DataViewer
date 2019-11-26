/*
 * DataViewer library
 * Copyright 2014-2017
 * Authors: Arno Kaimbacher
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 */

function _urlParam(e,t){var o=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(t);return null===o?null:o[1]||0}require.config({paths:{jquery:"../node_modules/jquery/dist/jquery.min",toastr:"../node_modules/toastr/toastr",ko:"../node_modules/knockout/build/output/knockout-latest",leaflet:"../node_modules/leaflet/dist/leaflet",text:"../node_modules/requirejs-text/text",i18n:"i18n"},urlArgs:"version=release3",shim:{toastr:{deps:["jquery"],exports:"toastr"},leaflet:{exports:"L"}}}),requirejs.s.contexts._.config.locale=_urlParam("lang",window.location.href)?_urlParam("lang",window.location.href):"en",require(["main"]);