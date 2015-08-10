(function() {
	'use strict';

	angular
		.module('app.home')
		.run(appRun);

	// appRun.$inject = ['routerHelper']
    
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    
    function getStates() {
        return [
            {
                state: 'home-components',
                config: {
                    parent: 'layout',
                    abstract: true,
                    views: {
                        'content': {
                            templateUrl: 'home/home.html'
                        }
                    }
                }
            },
            {
                state: 'home',
                config: {
                    url: '/home',
                    parent: 'home-components',
                    views: {
                        'chat': {
                            templateUrl: 'chat/chat.html',
                            controller: 'ChatController as vm'
                        },
                        'users': {
                            templateUrl: 'users/users.html',
                            controller: 'UsersController as vm'
                        }
                    }
                }
            }
        ];
    }
})();