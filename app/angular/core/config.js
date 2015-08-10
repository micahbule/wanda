(function() {
    'use strict';
    
    var core = angular.module('app.core');
    
    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Wanda',
        version: '0.1'
    };
    
    core.value('config', config);
    
    core.config(configure);
    
    /* @ngInject */
    function configure ($logProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        
        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
})();
