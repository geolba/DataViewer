// Filename: dataservice.js
define('app/dataservice',[
  "jquery",
  "helper/logger",
  "viewmodel/FilterViewModel",
  "viewmodel/model",
  "helper/utilities"
], function ($, logger, FilterViewModel, model, utilities) {

    //dataservice class
    var dataservice = function (queryUri, language) {
        var self = this;
        self.StartUri = queryUri;
        self.Lang = language;

        self.StartConcept;
        self.Result = {};
        self.EndpointUri;       

        // privileged public method for initializing
        self.primeData = function () {
            // run in parallel         
            return $.when(_init(), _getLocalization());
            //return $.when(_init());
        };

        //helper function
        var _getQueryIds = function (filterListViewModel) {
            var s = self.StartUri;
            if (filterListViewModel.narrower() && filterListViewModel.narrowerTerms()) {
                for (var i = 0; i < filterListViewModel.narrowerTerms().length; i++) {
                    var N = filterListViewModel.narrowerTerms()[i];
                    s += "," + N.uri;
                }
            }
            if (filterListViewModel.broader() && filterListViewModel.broaderTerms()) {
                for (var j = 0; j < filterListViewModel.broaderTerms().length; j++) {
                    var M = filterListViewModel.broaderTerms()[j];
                    s += "," + M.uri;
                }
            }
            if (filterListViewModel.related() && filterListViewModel.relatedTerms()) {
                for (var k = 0; k < filterListViewModel.relatedTerms().length; k++) {
                    var P = filterListViewModel.relatedTerms()[k];
                    s += "," + P.uri;
                }
            }
            return s;
        };

        self.refreshFilterViewModelItems = function (filterListViewModel, successCallback, failureCallback) {
            utilities.setLoading("left-bar");

            var s = _getQueryIds(filterListViewModel);

            var alltopicsA = filterListViewModel.narrowerTerms().concat(filterListViewModel.broaderTerms()).concat(filterListViewModel.relatedTerms());
            alltopicsA.unshift(self.StartConcept);
            var alltopics = alltopicsA.map(function (elem) {
                return elem.uri;
            }).join(",");
            
            var _tectonicuris = [];
            var _geologicunituris = [];            
            var _proportionuris = [];
            var _timescaleuris = [];

            var _lithologyuris = [];
            var _eventprocessuris = [];
            var _eventenvironmenturis = [];

            var _descriptionpurposeuris = [];

            var _collectiontitle;
           
            var items = filterListViewModel.activeFilterViewModelItems();
            for (var i = 0; i < items.length; i++) {
                var activeFilterViewModelItem = items[i];
                var activeFilterItems = activeFilterViewModelItem.activeFilterItems();
                var j, activeFilterItem;
                if (activeFilterViewModelItem.name === "TectonicUnit") {  
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _tectonicuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];                       
                        _tectonicuris.push(activeFilterItem.uri);                        
                    }
                }
                if (activeFilterViewModelItem.name === "GeologicUnit") {                   
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _geologicunituris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _geologicunituris.push(activeFilterItem.uri);
                    }
                }
                if (activeFilterViewModelItem.name === "Proportion") {                   
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _proportionuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _proportionuris.push(activeFilterItem.uri);
                    }
                }
                if (activeFilterViewModelItem.name === "TimeScale") {                   
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _timescaleuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _timescaleuris.push(activeFilterItem.uri);
                    }
                }
                //if (activeFilterViewModelItem.name === "GeologicCollectionTitle") {
                if (activeFilterViewModelItem.name === "Dataset") {
                    //_collectiontitle = activeFilterItem.filterItem.name;
                    _collectiontitle = activeFilterItems[0].name;
                }

                if (activeFilterViewModelItem.name === "Lithology") {
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _lithologyuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _lithologyuris.push(activeFilterItem.uri);
                    }
                }
                if (activeFilterViewModelItem.name === "EventProcess") {
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _eventprocessuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _eventprocessuris.push(activeFilterItem.uri);
                    }
                }
                if (activeFilterViewModelItem.name === "EventEnvironment") {
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _eventenvironmenturis.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _eventenvironmenturis.push(activeFilterItem.uri);
                    }
                }
                //zusätzlich für GeologicUnit                
                if (activeFilterViewModelItem.name === "DescriptionPurpose") {
                    //activeFilterItems.forEach(function (activeFilterItem) {
                    //    _descriptionpurposeuris.push(activeFilterItem.uri);
                    //});
                    for (j = 0; j < activeFilterItems.length; j++) {
                        activeFilterItem = activeFilterItems[j];
                        _descriptionpurposeuris.push(activeFilterItem.uri);
                    }
                }
            }

            var filter = {
                tectonicuris: _tectonicuris,
                geologicunituris: _geologicunituris,                
                proportionuris: _proportionuris,
                timescaleuris: _timescaleuris,
                dataset: _collectiontitle,

                lithologyuris: _lithologyuris,
                eventprocessuris: _eventprocessuris,
                eventenvironmenturis: _eventenvironmenturis,
                descriptionpurposeuris: _descriptionpurposeuris
            };
            var filters = JSON.stringify(filter, null, 2);

            var dbRequest = $.ajax({
                //url: "../tdv/AttributeHandler.ashx?language=&topics=" + s,
                url: "../tdv/AttributeHandler.ashx",
                type: "POST",
                data: { topics: s, alltopics:alltopics, filters: filters, uri: self.StartUri, language: self.Lang },
                dataType: "json"
            });
            dbRequest.done(dbRequestSucceeded)
           .fail(dbRequestFailed);

            function dbRequestSucceeded(response) {
                var filters = [];
               
                for (var i = 0; i < response.Filters.length; ++i) {
                   
                    var filterItems_of_filterViewModel = response[response.Filters[i].name];                   
                    var filterItems = [];
                    filterItems_of_filterViewModel.forEach(function (item) {
                        item.lang = self.Lang;
                        filterItems.push(new model.FilterItem(item));
                    });
                   
                    var filterViewModel = new FilterViewModel(response.Filters[i].name, response.Filters[i].localizedName, filterItems, filterListViewModel);
                  
                    var seen = false;
                    var arr = filterListViewModel.activeFilterViewModelItems();
                    for (var k = 0; k !== arr.length; ++k) {
                        if (arr[k].name === filterViewModel.name) {
                            seen = true;
                            //var activeFilterViewModel = arr[k];                            
                        }
                    }
                    //inactive filterViewModel on the left bar:
                    if (!seen) {
                        filters.push(filterViewModel);
                    }

                    
                }
                //filterViewModelItemsObservable(filters);
                filterListViewModel.filterViewModelItems(filters);
                filterListViewModel.allLIDs(response.L_ID);
                filterListViewModel.notIncludedUris(response.NotIncludedUris);

                utilities.unsetLoading("left-bar");
                if (typeof successCallback !== "undefined") {
                    successCallback();
                }
            }
            function dbRequestFailed(error) {
                logger.error('DB query failed: ' + error.statusText, true);
                utilities.unsetLoading("left-bar");
                if (typeof failureCallback !== "undefined") {
                    failureCallback();
                }
            }


        };

        //self.getFilterViewModelItems = function (filterListViewModel, filterViewModelItemsObservable, narrowerTerms, broaderTerms, relatedTerms, incNarrower, incBroader, incRelated) {
        self.getFilterViewModelItems = function (filterListViewModel, narrowerTerms, broaderTerms, relatedTerms, incNarrower, incBroader, incRelated) {
            //var INITIAL_STATE = [new FilterModel("", [])];
            //filtersItemsObservable(INITIAL_STATE);
            var s = self.StartUri;
            if (incNarrower && narrowerTerms) {
                for (var i = 0; i < narrowerTerms.length; i++) {
                    var N = narrowerTerms[i];
                    s += "," + N.uri;
                }
            }
            if (incBroader && broaderTerms) {
                for (var j = 0; j < broaderTerms.length; j++) {
                    var M = broaderTerms[j];
                    s += "," + M.uri;
                }
            }
            if (incRelated && relatedTerms) {
                for (var k = 0; k < relatedTerms.length; k++) {
                    var P = relatedTerms[k];
                    s += "," + P.uri;
                }
            }           

            var dbRequest = $.ajax({
                //url: "../tdv/AttributeHandler.ashx?language=&topics=" + s,
                url: "../tdv/AttributeHandler.ashx",
                type: "POST",
                data: { topics: s, uri: self.StartUri, language: "" },
                dataType: "json"
            });
            dbRequest.done(dbRequestSucceeded)
           .fail(dbRequestFailed);

            function dbRequestSucceeded(response) {
                var filters = [];
                var arrCopy;

                for (var i = 0; i < response.Filters.length; ++i)
                {
                    arrCopy = [];
                    for (var j = 0; j < response[response.Filters[i].name].length; ++j)
                    {
                        response[response.Filters[i].name][j].FilterID = i;
                    }
                    filters[i] = new FilterViewModel(response.Filters[i].name, response.Filters[i].localizedName, response[response.Filters[i].name], filterListViewModel);
                    //var test = filters[i].filterItems();
                }
                //filterViewModelItemsObservable(filters);
                filterListViewModel.filterViewModelItems(filters);
                filterListViewModel.allLIDs(response.L_ID);

            }
            function dbRequestFailed(error) {             
                logger.error('DB query failed: ' + error.statusText, true);
            }

        };
        
        self.getNarrowerTerms = function (id, endpoint) {
            var deferred = $.Deferred();

            if (endpoint === null || endpoint === "")
            {
                deferred.resolve([]);
                return deferred;               
            }
           
            /*jshint multistr: true */
            var queryString = "\
            PREFIX skos:<http://www.w3.org/2004/02/skos/core#> \
            select ?URI ?prefLabel \
            where { \
                <" + id + "> skos:narrower* ?URI .  \
                 ?URI skos:prefLabel ?prefLabel . FILTER ( lang(?prefLabel) = 'en' )   \
            }";


            var narrowerConcepts = [];
            //var endpointUrl = endpoint;

            var thesaurusRequest = $.ajax({
                type: 'POST',
                dataType: 'json',
                //timeout: 2000,
                url: endpoint,
                data: { query: queryString, format: "application/json" }
            });

            thesaurusRequest.done(narrowerConceptsQuerySucceeded)
            .fail(narrowerConceptsQueryFailed);

            function narrowerConceptsQuerySucceeded(data) {
                var hit = data.results.bindings;
                for (var i = 0; i < hit.length; i++) {                   
                    var concept = hit[i];
                    //wenn das narrower Konzept nicht das eigene Konzept ist, dann hinzufügen
                    if (id !== concept.URI.value) { 
                        narrowerConcepts.push({ name: concept.prefLabel.value, uri: concept.URI.value });
                    }
                }
                deferred.resolve(narrowerConcepts);
            }

            function narrowerConceptsQueryFailed(jqXHR, status, error) {              
                deferred.reject(error);
            }

            // Return the Promise so caller can't change the Deferred
            return deferred.promise();

        };

        //self.exportFilterResults = function (adlibLocationArray) {
        //    _download('../app/PdfHandler.ashx', '');           
        //};

        //var _download = function (url, data, method) {
        //    //url and data options required
        //    if (url) {
        //        //data can be string of parameters or array/object
        //        data = typeof data === 'string' ? data : jQuery.param(data);
        //        //split params into form inputs
        //        var inputs = '';
        //        $.each(data.split('&'), function () {
        //            var pair = this.split('=');
        //            inputs += "<input type='hidden' name='" + pair[0] + "' value='" + pair[1] + "' />";
        //        });
        //        //send request
        //        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
        //        .appendTo('body').submit().remove();
        //    }
        //};

        // private method for initializing
        var _init = function () {
            // 1) create the jQuery Deferred object that will be used
            var deferred = $.Deferred();

            self.EndpointUri = _getEndpoint(self.StartUri);

            var thesaurusRequest = $.ajax({
                type: "GET",
                url: self.EndpointUri,
                data: {
                    format: "application/xml",                   
                    query: "PREFIX skos:<http://www.w3.org/2004/02/skos/core#> SELECT ?URI ?prefLabel ?type {{SELECT DISTINCT ?URI ?prefLabel (\"broader\" AS ?type) WHERE {{<" + self.StartUri + "> skos:broader ?URI } ?URI skos:prefLabel ?prefLabel . FILTER ( lang(?prefLabel) ='" + self.Lang + "' )}} UNION { SELECT DISTINCT ?URI ?prefLabel (\"narrower\" AS ?type) WHERE {<" + self.StartUri + "> skos:narrower* ?URI . ?URI skos:prefLabel ?prefLabel . FILTER ( lang(?prefLabel) ='" + self.Lang + "' ) }} UNION {SELECT DISTINCT ?URI ?prefLabel (\"related\" AS ?type) WHERE {{<" + self.StartUri + "> skos:related ?URI } ?URI skos:prefLabel ?prefLabel . FILTER ( lang(?prefLabel) ='" + self.Lang + "' )}}}"
                },
                cache: false,
                dataType: "xml"
            });

            thesaurusRequest.done(thesaurusRequestSucceeded)
           .fail(thesaurusRequestFailed);           

            function thesaurusRequestSucceeded (xml) {
                self.Result = { broader: [], narrower: [], related: [] };
                $(xml).find('result').each(function () {
                    var t = $(this).find("binding[name='type']").find("literal").text();
                    var n = $(this).find("binding[name='prefLabel']").find("literal").text();
                    var u = $(this).find("uri").text();
                    if (self.StartUri !== u) {
                        var thesaurusTherm = new model.ThesaurusTerm({ name: n, uri: u, lang: self.Lang });
                        self.Result[t].push(thesaurusTherm);
                        //self.Result[t].push({ name: n, uri: u, active: true });
                    }
                    else {
                        //self.StartConcept = { name: n, uri: u, active: true };
                        self.StartConcept = new model.ThesaurusTerm({ name: n, uri: u,lang: self.Lang });
                    }
                });
                deferred.resolve();
            }

            function thesaurusRequestFailed(data) {
                deferred.reject(data);              
            }

            // Return the Promise so caller can't change the Deferred
            return deferred.promise();

        };

        // private method for initializing
        var _getLocalization = function () {
            var deferred = $.Deferred();          

            //Bi-directional language support added to support right-to-left languages like Arabic and Hebrew
            var dirNode = document.getElementsByTagName("html")[0];        
            var direction = document.body.style.direction;

            //if (this.config.i18n.isRightToLeft) {
            if (direction === "") {
                dirNode.setAttribute("dir", "ltr");                        
            } else {
                dirNode.setAttribute("dir", "rtl");
            }

            deferred.resolve(true);
            return deferred.promise;

        };     

        //helper method
        var _getEndpoint = function (queryUri) {
            if (queryUri === null) {
                return "";
            }
            var value = queryUri;
            var ix = value.lastIndexOf('/');
            var _uri = value.substring(0, ix + 1);
            var endpoint = "";
            var protocol = ('https:' === document.location.protocol ? 'https:' : 'http:');
            switch (_uri)
            {

                case "http://resource.geolba.ac.at/GeologicUnit/":                  
                    endpoint = protocol + "//resource.geolba.ac.at/PoolParty/sparql/GeologicUnit";
                    break;
                case "http://resource.geolba.ac.at/tectonicunit/":                  
                    endpoint = protocol + "//resource.geolba.ac.at/PoolParty/sparql/tectonicunit";
                    break;                 
                case "http://resource.geolba.ac.at/lithology/":                   
                    endpoint = protocol + "//resource.geolba.ac.at/PoolParty/sparql/lithology";
                    break;
                case "http://resource.geolba.ac.at/GeologicTimeScale/":                   
                    endpoint = protocol + "//resource.geolba.ac.at/PoolParty/sparql/GeologicTimeScale";
                    break;               
                default :
                    endpoint = "";
                    break;
            }

            return endpoint;
        };

    };//end of dataservice class

    return dataservice;
});