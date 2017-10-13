define('viewmodel/FilterViewModel',[
    "jquery",
    "ko",
    "helper/logger",
    "i18n!nls/template"
], function ($, ko, logger, myLabels) {

  
    //FilterViewModel class
    var FilterViewModel = function (name, localizedName, filterItems, filterListViewModel) {
        var self = this;

        //constant private variable
        var ITEMS_PER_FILTER = 5;

        // properties
        self.name = name;
        self.localizedName = localizedName;
        self.dataservice = filterListViewModel.dataservice;
        //self.isViewModelVisible = ko.observable(true);

        self.filterItems = ko.observableArray(filterItems);
        //self.activeFilterItems = ko.observableArray([]);
        self.filterListViewModel = filterListViewModel;      


        //self.inactiveFilterItems = ko.computed(function () {
        //    var arr = [];
        //    var items = self.filterItems();

        //    for (var i = 0; i < items.length; ++i) {
        //        //if (!self.isActive(items[i])) {
        //        var fItem = items[i];
        //        if (!fItem.isItemActive) {
        //            arr[arr.length] = items[i];
        //        }
        //    }
        //    return arr;
        //});

        self.activeFilterItems = ko.computed(function () {
            var arr = [];
            var items = self.filterItems();

            for (var i = 0; i < items.length; ++i) {             
                var fItem = items[i];
                if (fItem.isItemActive()) {
                    arr[arr.length] = items[i];
                }
            }        
            return arr;
        });
        
        self.itemLabel = function (filterItem) {
            //return filterItem.name + " (" + filterItem.l_id.length + ")" + "<label class='tooltip'> &#160;&#8594;&#160;<span>" + filterItem.description + "</span></label>";
            //return filterItem.name + " (" + filterItem.l_id.length + ")" + "<label title='" + filterItem.description + "' class='tooltip'> &#160;&#8594;&#160;</label>";
            return filterItem.name;
        };
        self.itemLabel2 = function (filterItem) {
            var label = " (" + filterItem.l_id2.length + ") ";
            if (filterItem.uri !== null) {
                if (filterItem.description !== null) {
                    //label += "<a href='" + filterItem.uri + "' target='_blank' title='" + filterItem.description + "' class='tooltip'> &#160;&#8801;&#160;<a>";
                    label += "<a href='" + filterItem.uri + "' target='_blank' title='" + filterItem.description + "' class='tooltip'> Info<a>";
                }
                else {
                    //label += "<a href='" + filterItem.uri + "' target='_blank' class='tooltip'> &#160;&#8801;&#160;<a>";
                    label += "<a href='" + filterItem.uri + "' target='_blank' class='tooltip'> Info<a>";
                }
            }
            //var label = "test";
            return label;           
        };

        self.activateItem = function (filterItem) {           
            filterItem.setActive();         

            //NEU NEU: query all recursive narrower terms and search if they are in self.filterItems:
            //if there any 
            self.dataservice.getNarrowerTerms(filterItem.uri, filterItem.endpoint)
            .then(function (data) {
                if (data.length <= 0) {
                    self.filterListViewModel.activeFilterViewModelItems.push(self);
                    self.dataservice.refreshFilterViewModelItems(self.filterListViewModel, function () {
                        self.filterListViewModel.refreshMap();
                    }, function () {
                        //utilities.unsetLoading("map");
                    });
                    return;
                }
                var narrowerConcepts = data;
                var filterItems = self.filterItems();
                //var alsoActiveItems = [];
                for (var i = 0; i < filterItems.length; i++)
                {
                    var _filterItem = filterItems[i];
                    for (var j = 0; j < narrowerConcepts.length; j++)
                    {
                        var concept = narrowerConcepts[j];
                        if (concept.uri === _filterItem.uri)
                        {                         
                            _filterItem.setActive();                           
                        }
                    }
                }    
               
                self.filterListViewModel.activeFilterViewModelItems.push(self);
                self.dataservice.refreshFilterViewModelItems(self.filterListViewModel, function () {
                    self.filterListViewModel.refreshMap();
                }, function () {
                    //utilities.unsetLoading("map");
                });


            })
           .fail(function (error) {
               logger.error("Recursive narrower concepts couldn't be queried: " + error, true);
           });

        };
 
        self.overflowing = ko.computed(function () {
            //ko.observable(self.filterItems().length - self.activeFilterItems().length > ITEMS_PER_FILTER);
            return (self.filterItems().length) > ITEMS_PER_FILTER;
        });
        self.collapsed = ko.observable(true);
        self.uncollapseLabelText = ko.computed(function () {
            if (self.collapsed() === true) {
                //return Dictionary.getText("ShowAll", language);
                return myLabels.viewer.sidePanel.more; //"More results";
            }
            else {
                //return Dictionary.getText("Collapse", language);
                return myLabels.viewer.sidePanel.collapse; //"Collapse";
            }
        });

        self.toggle = function () {
            //var list = $(event.target).parents("ul").prev();

            if (self.collapsed() === true) {
                self.collapsed(false);                
                //list.children("li:gt(4)").show();             
            } 
            else if(self.collapsed() === false){
                self.collapsed(true);
                //list.children("li:gt(4)").hide();             
            }
        };

    };//end of 'FilterListViewModel' class

    return FilterViewModel;
});