// Filename: app.js
define('app/app',[
  "jquery",
  "helper/logger",
  "app/map2",
  "app/dataservice",
  "viewmodel/FilterListViewModel",
  "ko"
], function ($, logger, Map, Dataservice, FilterListViewModel, ko) {

    var init = function (language) {

        var url = window.location.href;
        var uri = _urlParam("url", url);

        if (uri === undefined || uri === null) {
            logger.error('App initialization failed: no uri parameter', true);
        }
        else {
            ////initialize google analytics:
            //var _gaq = window._gaq = window._gaq || [];
            //_gaq.push(['_setAccount', 'UA-36825195-1']);
            //_gaq.push(['_trackPageview']);                 
            //var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            //ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            //var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

            //init the sparql data:
            var dataservice = new Dataservice(uri, language);
            dataservice.primeData()
           .then(boot)
           .fail(failedInitialization);
        }

        function boot() {

            //init the map:
            var map = new Map("map");
            map.init();

            var viewModel = new FilterListViewModel(dataservice, map, uri);
            ko.applyBindings(viewModel);
            viewModel.initialize(function () {
                logger.success("DataViewer successfully loaded!", true);
            },
            function () {
                logger.error("Filter konnten nicht intialisiert werden!", true);
            });
            //logger.success("DataViewer successfully loaded!", true);            
        }

        function failedInitialization(error) {
            logger.error('App initialization failed: ' + error.statusText, true);
        }

    };

    var _urlParam = function(parameter, url){
        var results = new RegExp('[\\?&]' + parameter + '=([^&#]*)').exec(url);
        if (results===null){
            return null;
        }
        else{
            return results[1] || 0;
        }
    };

    return {
        init: init
    };
});
