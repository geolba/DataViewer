//Contents of nls/template.js
define('nls/template',{
    // root is mandatory.
    root: {
        viewer: {
            main: {
                scaleBarUnits: "metric", //"english (for miles) or "metric" (for km) - don't translate.
                otherLng: "de",
                otherLngImg: "../content/img/at.png"
            },
            terms: {
                narrower: "narrower concepts",
                activeNarrower: "including narrower concepts",
                broader: "broader concepts",
                activeBroader: "including broader concepts",
                related: "related concepts",
                activeRelated: "including related concepts",
                filter: "restricted to"
            },
            sidePanel: {
                title: "Refine by",
                collapse: "collapse",
                more: "all terms.."
                //filter: {
                //    GeologicUnit: "Geologic unit",
                //    TectonicUnit: "Lithotectonic unit",
                //    Dataset: "Dataset",
                //    Proportion: "Proportion"
                //}
            },
            footer: {
                    actualYear: "&#169; " + new Date().getFullYear() + " GBA",
                    contact: "Contact",
                    accessConstraints: "Terms of use",
                    disclaimer: "Disclaimer"
            },
            buttons: {
                btnClearFilter: "Clear"
            },
            messages: {
                waitMessage: "Please wait...",
                featuresTagged: "Geologic Features tagged with",
                pointsPartially: "(partially shown in the map)"
            }
        },
        red: "red",
        blue: "blue",
        green: "green"        
    },
    "de": true
});