//Contents of nls/de/template.js
define({
    viewer: {
        main: {
            scaleBarUnits: "english", //"english (for miles) or "metric" (for km) - don't translate.
            otherLng: "en",
            otherLngImg: "../content/img/gb.png"
        },
        terms: {
            narrower: "untergeordnete Begriffe",
            activeNarrower: "inkl. untergeordnete Begriffe",
            broader: "übergeordnete Begriffe",
            activeBroader: "inkl. übergeordnete Begriffe",
            related: "verwandte Begriffe",
            activeRelated: "inkl. verwandte Begriffe",
            filter: "eingeschränkt auf"
        },
        sidePanel: {
            title: "Filter nach",
            collapse: "Ausblenden",
            more: "alle Begriffe.."
            //filter: {
            //    GeologicUnit: "Geologische Einheit",
            //    TectonicUnit: "Lithotektonische Einheit",
            //    Dataset: "Dataset",
            //    Proportion: "Proportion"
            //}
        },
        footer: {
            actualYear: "&#169; " + new Date().getFullYear() + " GBA",
            contact: "Kontakt",
            accessConstraints: "Nutzungsbedingungen",
            disclaimer: "Haftungsausschluss"
        },
        buttons: {
            btnClearFilter: "Löschen"
        },
        messages: {
            waitMessage: "Bitte warten...",
            featuresTagged: "Einheiten im Zusammenhang mit",
            pointsPartially: "(teilweise in der Karte dargestellt)"
        }
    },
    red: "rot",
    blue: "blau",
    green: "grün"    
});