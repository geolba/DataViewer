/*
 * DataViewer library
 * Copyright 2014-2017 Geologische Bundesanstalt
 * Authors: Arno Kaimbacher
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 */
//main module 
define('main', ["app/app", "jquery"], function (App, $) {

    var lang = requirejs.s.contexts._.config.locale;
    $(document).ready(function () {
        App.init(lang);
    });

});
