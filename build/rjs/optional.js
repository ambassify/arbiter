define("optional", [], {
    load : function (moduleName, parentRequire, onload, config){

        var onLoadSuccess = function(moduleInstance){
            // Module successfully loaded, call the onload callback so that
            // requirejs can work its internal magic.
            onload(moduleInstance);
        }

        try {
            parentRequire([moduleName], onLoadSuccess);
        } catch (e) {
            // Now define the module instance as a simple empty object
            define(moduleName, [], function(){return;});

            // Now require the module make sure that requireJS thinks 
            // that is it loaded. Since we've just defined it, requirejs 
            // will not attempt to download any more script files and
            // will just call the onLoadSuccess handler immediately
            parentRequire([moduleName], onLoadSuccess);
        }

    }
});