// Filename: module: model.js
define('viewmodel/model',[
  "ko",
], function (ko) {   

    var FilterItem = function (dto) {       
        //--------------
        // below is one way to do this, could be very manual. 
        // Instead we map them from json object to ko.observables.
        //--------------
        //var self = this;
        //self.uri = ko.observable();
        //self.description = ko.observable();       
        //--------------
        //return _filterItemInitializer(_mapToObservable(dto));
        return _filterItemInitializer(dto);
    };   
    var _filterItemInitializer = function (item)
    {       
        item.selected = ko.observable(false);
        item.toggle = function () {
            item.selected(!item.selected());
        };

        item.isItemActive = ko.observable(false);
        item.setActive = function () {
            item.isItemActive(true);
        };
        item.uriWithLang = ko.computed(function () {
            return item.uri + "&lang=" + item.lang;
        });
        item.idLabel = ko.computed(function () {
            var label = "";
            for (var index = 0; index < item.l_id2.length; index++) {
                label += item.l_id2[index].l_id+"; ";
            }
            return label;
        });
       
        return item;
    };

    var ThesaurusTerm = function (dto) {      
        //--------------
        // below is one way to do this, could be very manual. 
        // Instead we map them from json object to ko.observables.
        //--------------
        //var self = this;
        //self.uri = ko.observable();
        //self.description = ko.observable();       
        //--------------
        //return _filterItemInitializer(_mapToObservable(dto));
        return _thesaurusTermInitializer(dto);
    };
    var _thesaurusTermInitializer = function (item) {     

        item.isTermActive = ko.observable(true);
        item.setInActive = function () {
            item.isTermActive(false);
        };
        item.uriWithLang = ko.computed(function () {
            return item.uri + "&lang=" + item.lang;
        });
        return item;
    };


    return {
        FilterItem: FilterItem,
        ThesaurusTerm: ThesaurusTerm
    };

});