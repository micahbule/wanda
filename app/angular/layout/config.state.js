(function() {
    'use strict';
    
    angular
        .module('app.core')
        .run(appRun);
        
    // appRun.$inject = ['routerHelper']
    
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), 'home');
    }
    
    function getStates() {
        return [
            {
                state: 'layout',
                config: {
                    abstract: true,
                    templateUrl: 'layout/menu.html',
                    controller: 'MenuController as vm'
                }
            }
        ];
    }
})();
