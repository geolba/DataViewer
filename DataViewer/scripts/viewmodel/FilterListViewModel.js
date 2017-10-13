// Filename: FilterListViewModel.js
define('viewmodel/FilterListViewModel',[
  "ko",
  "app/dataservice",
  "helper/utilities",
  "helper/logger",
  "i18n!nls/template"
], function (ko, dataservice, utilities, logger, myLabels) {

    //dataservice class
    var FilterListViewModel = function (dataservice, map, uri) {
        var self = this;

        self.startUri = uri;
        self.dataservice = dataservice;
        
        self.filterViewModelItems = ko.observableArray([]);
        self.activeFilterViewModelItems = ko.observableArray([]);
              
        self.notIncludedUris = ko.observableArray([]);

        //self.visibleFilterViewModelItems = ko.computed(function () {
        //    var f = self.filterViewModelItems();
        //    var result = [];

        //    for (var i = 0; i < f.length; ++i) {
        //        if (f[i].activeFilterItems().length == 0) {
        //            result[result.length] = f[i];
        //        }
        //    }
        //    return result;
        //});

        self.allLIDs = ko.observableArray([]);

        self.narrower = ko.observable(true);
        self.broader = ko.observable(false);
        self.related = ko.observable(false);
        //self.hasActiveRelatedTerms = ko.observable(false);
        self.narrower.subscribe(function (newValue) {
            logger.info('Narrower: ' + newValue, true);
            _refreshFilterViewModelItems();
        });
        self.broader.subscribe(function (newValue) {
            logger.info('Broader: ' + newValue, true);
            _refreshFilterViewModelItems();
        });
        self.related.subscribe(function (newValue) {
            logger.info('Related: ' + newValue, true);
            _refreshFilterViewModelItems();
        });

        //normal arrays
        //self.narrowerTerms = dataservice.Result.narrower;
        self.narrowerTerms = ko.observableArray(dataservice.Result.narrower);
        //self.broaderTerms = dataservice.Result.broader;
        self.broaderTerms = ko.observableArray(dataservice.Result.broader);
        //self.relatedTerms = dataservice.Result.related;
        self.relatedTerms = ko.observableArray(dataservice.Result.related);

        var _refreshFilterViewModelItems = function () {
            
            self.activeFilterViewModelItems.removeAll();
            self.makeAllTermsActive();
           
            //self.dataservice.getFilterViewModelItems(self, self.narrowerTerms, self.broaderTerms, self.relatedTerms, self.narrower(), self.broader(), self.related());
            self.dataservice.refreshFilterViewModelItems(self, function () {
                map.setHomeExtent();
                self.refreshMap();               
            }, function () {
                //utilities.unsetLoading("map");               
            });
        };

        //set thesaurus uris inactive if they are not included anymore because of filtering
        self.notIncludedUris.subscribe(function () {
            var notIncludedUris = self.notIncludedUris();

            if (notIncludedUris.length > 0) {
             
                if (notIncludedUris.indexOf(dataservice.StartConcept.uri) > -1) {
                    dataservice.StartConcept.isTermActive(false);
                }

                var i;
                for (i = 0; i < self.narrowerTerms().length; i++) {
                    var narrowerTerm = self.narrowerTerms()[i];
                    //if in the array set inactive
                    if (notIncludedUris.indexOf(narrowerTerm.uri) > -1) {
                        narrowerTerm.isTermActive(false);
                    }                  
                }
                for (i = 0; i < self.broaderTerms().length; i++) {
                    var broaderTerm = self.broaderTerms()[i];
                    //if in the array set inactive
                    if (notIncludedUris.indexOf(broaderTerm.uri) > -1) {
                        broaderTerm.isTermActive(false);
                    }
                }
                for (i = 0; i < self.relatedTerms().length; i++) {
                    var relatedTerm = self.relatedTerms()[i];
                    //if in the array set inactive
                    if (notIncludedUris.indexOf(relatedTerm.uri) > -1) {
                        relatedTerm.isTermActive(false);
                    }
                    //if (relatedTerm.isTermActive()) {
                    //    self.hasActiveRelatedTerms(true);
                    //}
                }

                //self.narrowerTerms.sort(function (a, b) {
                //    return a.name.localeCompare(b.name);
                //});    
                if (self.narrower()) {
                    //You must return 0 when a and b both have same value, -1 if a is true(no sort) and 1 otherwise.
                    self.narrowerTerms.sort(function (a, b) {
                        return (a.isTermActive() === b.isTermActive()) ? 0 : a.isTermActive() ? -1 : 1;
                    });
                }
                if (self.broader()) {
                    self.broaderTerms.sort(function (a, b) {
                        return (a.isTermActive() === b.isTermActive()) ? 0 : a.isTermActive() ? -1 : 1;
                    });
                }
                if (self.related()) {
                    self.relatedTerms.sort(function (a, b) {
                        return (a.isTermActive() === b.isTermActive()) ? 0 : a.isTermActive() ? -1 : 1;
                    });
                }

            }
          
        });

        self.makeAllTermsActive = function () {
            dataservice.StartConcept.isTermActive(true);
            var i;
            for (i = 0; i < self.narrowerTerms().length; i++) {
                var narrowerTerm = self.narrowerTerms()[i];
                narrowerTerm.isTermActive(true);               
            }
            for (i = 0; i < self.broaderTerms().length; i++) {
                var broaderTerm = self.broaderTerms()[i];
                broaderTerm.isTermActive(true);
            }
            for (i = 0; i < self.relatedTerms().length; i++) {
                var relatedTerm = self.relatedTerms()[i];
                relatedTerm.isTermActive(true);
            }
        };
       

        //self.red = template.red;
        self.labels = myLabels;

        self.changeLanguage = function () {
            localStorage.setItem('tdv-locale', myLabels.viewer.main.otherLng);
            location.reload();
        };

        var initialized = false;
        self.initialize = function (successCallback, failureCallback) {
            if (initialized) {
                return;
            }
            initialized = true;
            //dataservice.getFilterViewModelItems(self, self.narrowerTerms, self.broaderTerms, self.relatedTerms, self.narrower(), self.broader(), self.related());
            self.dataservice.refreshFilterViewModelItems(self, function () {              
                self.refreshMap();
                if (typeof (successCallback) !== "undefined") {
                    successCallback();
                }
            }, function () {
                if (typeof (failureCallback) !== "undefined") {
                    failureCallback();
                }
            });
        };

        self.formatTermURL = function (termItem) {           
            //return "?url=" + termItem.uri;
            return "?url=" + termItem.uriWithLang();
        };
        self.formatFilterTermURL = function (termItem) {
            if (termItem.endpoint === "") {
                return null;
            }
            else {
                //return "?url=" + termItem.uri;
                return "?url=" + termItem.uriWithLang();
            }
        };
        self.isGbaTerm = function (termItem) {
            if (termItem.endpoint === "") {
                return false;
            }
            else {
                return true;
            }
        };

        self.hasActiveRelatedTerms = ko.computed(function () {
            for (var i = 0; i < self.relatedTerms().length; i++) {
                var relatedTerm = self.relatedTerms()[i];
                //if in the array set inactive
                if (relatedTerm.isTermActive()) {
                    return true;
                }
            }
            return false;
        });
        self.hasActiveNarrowerTerms = ko.computed(function () {
            for (var i = 0; i < self.narrowerTerms().length; i++) {
                var narrowerTerm = self.narrowerTerms()[i];
                //if in the array set inactive
                if (narrowerTerm.isTermActive()) {
                    return true;
                }
            }
            return false;
        });
        self.hasActiveBroaderTerms = ko.computed(function () {
            for (var i = 0; i < self.broaderTerms().length; i++) {
                var broaderTerm = self.broaderTerms()[i];
                //if in the array set inactive
                if (broaderTerm.isTermActive()) {
                    return true;
                }
            }
            return false;
        });

        self.lidCountLabel = ko.computed(function () {
            //var label = self.allLIDs().length + " Geologic Features tagged with ";
            var label = self.allLIDs().length + " " + myLabels.viewer.messages.featuresTagged;
            return label;
            //return "("+ self.allLIDs().length + " features)";
        });
     
        self.inactivateFilterViewModelItem = function () {
            //self.activeFilterViewModelItems.remove(activateFilterViewModelItem);
            self.activeFilterViewModelItems([]);
            self.makeAllTermsActive();

            self.dataservice.refreshFilterViewModelItems(self, function () {
                map.setHomeExtent();
                self.refreshMap();
            }, function () {
                //utilities.unsetLoading("map");
            });      
            //self.refreshMap();
        };
        
        self.refreshMap = function(){            
            //var activeFilters = self.activeFilterViewModelItems();
                      
            var lids = self.allLIDs();
         
            //if (activeFilters.length > 0) {
            //    //for (var i = 0; i < activeFilters.length; ++i) {
            //    //var active = activeFilters[i].activeFilterItems();
            //    var activeFilterItems = [];
            //    var active = activeFilters[activeFilters.length - 1];//.activeFilterItems();
            //    if (active) {
            //        activeFilterItems = active.activeFilterItems();
            //    }
              

            //    for (var j = 0; j < activeFilterItems.length; ++j) {
            //        //activeItems[activeItems.length] = activeFilterItems[j];
            //        var lidArray = activeFilterItems[j].l_id2;
            //        //lids = lids.concat(lidArray);
            //        for (i = 0; i < lidArray.length; i++) {
            //            var id_object = lidArray[i];
            //            if (! _objectPropInArray(lids, 'l_id', id_object.l_id)) {
            //                lids.push(id_object);
            //            }
            //        }


            //    }                
               
            //    //if (lids.length > 80) {
            //    //    lids = lids.slice(0, 80);
            //    //    logger.info('only 80 legend ids are queried', true);
            //    //}
                
            //}
            //else {
            //    lids = self.allLIDs();
            //    //if (lids.length > 80)
            //    //{
            //    //    lids = lids.slice(0, 80);
            //    //    logger.info('only 80 legend ids are queried', true);
            //    //}
            //}

            //check if "lithology" is in the url:
            var isLithology;
            if (self.startUri.indexOf("lithology") > -1) {
                isLithology = true;
            }
            else {
                isLithology = false;
            }



            utilities.setLoading("map");           
            map.showL_ID(lids, isLithology, function () {
                utilities.unsetLoading("map");
            }, function () {
                utilities.unsetLoading("map");
            });
            //utilities.unsetLoading("map");
        };

    };//end of 'FilterListViewModel' class

    return FilterListViewModel;
});