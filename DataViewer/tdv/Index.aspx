<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="DataViewer.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=7,IE=9,IE=10" />
    <meta content="de-at" http-equiv="Content-Language" />
    <meta content="Copyright © 2015, Geologische Bundesanstalt All Rights Reserved" name="copyright" />
    <meta name="description" content="Thesaurus DataViewer"/>
    <link href="../content/img/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <title>DataViewer</title>

    <!--STYLES -->  
  <%--  <link rel="stylesheet" href="../content/app.css?version=release3" />--%>
     <link rel="stylesheet" href="../content/concat.min.css?version=release2" media="all" /> 
</head>
<body>  
    <div id="mainWindow">

        <%--<div class="header">           
            <div id="languageswitch" data-icon-en="../content/img/gb.png " data-icon-de="../content/img/at.png ">
                <div id="chkLanguage" data-bind="click: changeLanguage" ></div>         
                <img src="../content/img/at.png" data-bind="attr: { src: labels.viewer.main.otherLngImg }" />
                <span data-bind="text: labels.viewer.main.otherLng"></span>
            </div>               
        </div>--%>

        <div id="main" class="content">

            <div id="div_left_bar" class="sidebar left">
                <div id="left-bar">                    
                    <span data-bind="text: labels.viewer.sidePanel.title" class="indexheader"></span>

                   <div data-bind="foreach: filterViewModelItems">
                       <!-- ko if: activeFilterItems().length == 0 -->

                            <span data-bind="text: localizedName" class="filterViewModelName"></span>
                            <ul class="filterItems" data-bind="css: { limited: filterItems().length > 5 && collapsed() }">
                                <!-- ko foreach: $data.filterItems -->                                   
                                       <%-- <li data-bind="event: { mouseover: toggle, mouseout: toggle }, css: { hover: selected }">--%>
                                        <li>
                                            <a class="firstLabel" data-bind="html: $parent.itemLabel($data), click: $parent.activateItem, css: { active: isItemActive() }"></a>
                                            <span data-bind="html: $parent.itemLabel2($data),"></span>                                       
                                        </li>   
                                <!-- /ko -->
                            </ul>

                            <!-- ko if: $data.overflowing -->               
                                <ul class="overflowing">
                                    <li><span data-bind="text: uncollapseLabelText, click: toggle"></span></li>
                                </ul>
                            <!-- /ko -->

                        <!-- /ko -->
                   </div>   
                </div>
            </div>

            <div id="right-bar" class="sidebar right"> 
                <div id="div_map">
                    <div class="gbamap" id="map">      
                    </div>
                </div>
                <div id="div_overview">
                    <div id="overview">
                        <div id="termheader">                           
                            <label class="term-name" data-bind="text: lidCountLabel"></label>
                            <span>&nbsp;</span>
                             <%--<a class="nogbaterm" data-bind="text: dataservice.StartConcept.name"></a>--%>
                            <a data-bind="text: dataservice.StartConcept.name, css: dataservice.StartConcept.isTermActive() == false ? 'unactivegbaterm' : 'gbaterm'"></a>
                            <label class="term-name2" data-bind="text: labels.viewer.messages.pointsPartially, visible: allLIDs().length > 160"></label>
                        </div>
                        <table>
                              <tr data-bind="visible: broaderTerms().length > 0">
                                <td>
                                    <input id="cbBroaderTerms" type="checkbox" data-bind="checked: $root.broader, enable: $root.hasActiveBroaderTerms()" class="css-checkbox" />                                 
                                    <%--<label for="cbBroaderTerms" data-bind="text: labels.viewer.terms.broader" class="css-label"></label>--%>
                                    <label for="cbBroaderTerms" data-bind="text: $root.broader() ? labels.viewer.terms.activeBroader : labels.viewer.terms.broader" class="css-label"></label>
                                    <span>&nbsp;</span>
                                     <!-- ko foreach: broaderTerms -->                                    
                                        <a data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: isTermActive() == false ? 'unactivegbaterm' : $root.broader() == true ? 'gbaterm' : 'middlegbaterm'"></a>
                                        <%--<a data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: $root.broader() == false ? 'unactivegbaterm' : isTermActive() == true ? 'gbaterm' : 'unactivegbaterm' "></a>--%>
                                    <!-- /ko -->
                                </td>                              
                            </tr>

                            <tr data-bind="visible: narrowerTerms().length > 0">
                                <td>                                   
                                    <input id="cbNarrowerTerms" type="checkbox" data-bind="checked: $root.narrower, enable: $root.hasActiveNarrowerTerms()" class="css-checkbox" />                                   
                                    <%--<label for="cbNarrowerTerms" data-bind="text: labels.viewer.terms.narrower" class="css-label"></label>       --%>  
                                    <label for="cbNarrowerTerms" data-bind="text: $root.narrower() ? labels.viewer.terms.activeNarrower : labels.viewer.terms.narrower" class="css-label"></label>   
                                    <span>&nbsp;</span>
                                     <!-- ko foreach: narrowerTerms -->                                    
                                        <a id="narrowerTerm" data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: isTermActive() == false ? 'unactivegbaterm' :  $root.narrower() == true ? 'gbaterm' : 'middlegbaterm' "></a>
                                       <%-- <a id="narrowerTerm" data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: $root.narrower() == false ? 'unactivegbaterm' : isTermActive() == true ? 'gbaterm' : 'unactivegbaterm' "></a>--%>
                                    <!-- /ko -->                              
                                </td>                            
                            </tr>                          

                            <tr data-bind="visible: relatedTerms().length > 0">
                                <td>
                                    <input id="cbRelatedTerms" type="checkbox" data-bind="checked: $root.related, enable: $root.hasActiveRelatedTerms()" class="css-checkbox" />                                  
                                    <%--<label for="cbRelatedTerms" data-bind="text: labels.viewer.terms.related" class="css-label"></label>--%>
                                    <label for="cbRelatedTerms" data-bind="text: $root.related() ? labels.viewer.terms.activeRelated : labels.viewer.terms.related" class="css-label"></label>
                                    <span>&nbsp;</span>
                                     <!-- ko foreach: relatedTerms -->                                   
                                        <a data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: isTermActive() == false ? 'unactivegbaterm' : $root.related() == true ? 'gbaterm' : 'middlegbaterm' "></a>
                                        <%--<a data-bind="text: name, attr: { href: $root.formatTermURL($data) }, css: $root.related() == false ? 'unactivegbaterm' : isTermActive() == true ? 'gbaterm' : 'unactivegbaterm' "></a>--%>
                                    <!-- /ko -->
                                </td>                               
                            </tr>

                            <tr data-bind="visible: activeFilterViewModelItems().length > 0">
                                <td>
                                    <input id="cbFilterTerms" type="checkbox" checked="checked" data-bind="click: $root.inactivateFilterViewModelItem" class="css-checkbox" />                                
                                    <label for="cbFilterTerms" data-bind="text: labels.viewer.terms.filter" class="css-label"></label>
                                     <!-- ko foreach: activeFilterViewModelItems -->
                                        <%--<span data-bind="text: name"></span>--%>
                                        <!-- ko foreach: activeFilterItems -->
                                            <a href="#" data-bind="text: name, attr: { href: $root.formatFilterTermURL($data) }, css: { gbaterm: $root.isGbaTerm($data), nogbaterm: !$root.isGbaTerm($data) }"></a>
                                        <!-- /ko -->
                                    <!-- /ko -->
                                </td>                             
                            </tr>

                        </table>                     

                    </div>
                </div>
            </div>

      
        </div>

     <%--   <div class="footer">   
            <div class="footerContent">  
                <span data-bind="html: labels.viewer.footer.actualYear"></span> 
                <span>|</span>                         
                <a href="http://creativecommons.org/licenses/by-sa/3.0/at/" target="_blank" data-bind="text: labels.viewer.footer.accessConstraints"></a>
                <span>|</span>
                <a href="mailto:thesaurus@geologie.ac.at" data-bind="text: labels.viewer.footer.contact"></a>
                <span>|</span>
                <a href="../thesaurus_disclaimer.html" target="_blank" data-bind="text: labels.viewer.footer.disclaimer"></a>               
            </div>
        </div>--%>

    </div>

    <!-- Kick it off - data-main attribute tells require.js to load scripts/main.js after require.js loads. -->
    <%--<script src="../node_modules/requirejs/require.js" data-main="../scripts/config.js"></script>--%> 
    
    <script src="../dist/require.js" data-main="../dist/buildconfig.js"></script>
 
</body>
</html>