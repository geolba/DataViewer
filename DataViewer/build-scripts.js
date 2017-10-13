({
    mainConfigFile: "scripts/buildconfig.js",
    optimizeCss: "default",
    fileExclusionRegExp: /^(r|build)\.js$/,
    // base path for the r.js compiler to use
    baseUrl: "scripts",
    //name: "main",
    //out: "dist/main.js",
    removeCombined: true,
    findNestedDependencies: true,
    //specifies the type of optimization, or minification, to use, such as uglify2 or none
    optimize: "uglify2",
    //when present, automatically inserts a require() statement for the specified module at the end of the built output file.
    "insertRequire": ["main"],
    dir: "dist",
    useStrict: true,
  

    //Put in a mapping so that 'requireLib' in the
    //modules section below will refer to the require.js
    //contents.
    paths: {
        require: '../node_modules/requirejs/require',
        jquery: '../node_modules/jquery/dist/jquery.min',      
        toastr: '../node_modules/toastr/toastr',
        ko: '../node_modules/knockout/build/output/knockout-latest',
        leaflet: '../node_modules/leaflet/dist/leaflet',
        text: "../node_modules/requirejs-text/text",
        i18n: "i18n"
    },

    modules: [
        {
            name: "buildconfig",
            include: ["i18n!nls/de/template"],
            exclude: [
                "jquery",
                "toastr",
                "ko",
                "leaflet",
                "text",
                "i18n"
            ]
        }
    ]  
});