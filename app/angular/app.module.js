(function() {
    'use strict';
    
    angular
        .module('app', [
            /*
             * Order is not important. Angular makes a
             * pass to register all of the modules listed
             * and then when app.dashboard tries to use app.data,
             * its components are available.
             */
            'btford.socket-io',
            'ngNotify',
            /*
             * Everybody has access to these.
             * We could place these under every feature area,
             * but this is easier to maintain.
             */
            'ui.router',
            'app.core',
            'sockets',
            /*
             * Feature areas
             */
            'app.layout',
            'app.home',
            'app.users',
            'app.chat'
        ])
        .run(runBlock);
        
    /* @ngInject */
    function runBlock(ngNotify, SocketsFactory) {
        SocketsFactory.on('error', function (data) {
            ngNotify.set(typeof data.error === 'string' ? data.error : data.error.message, {
                type: 'error'
            });
        });

        ngNotify.config({
            theme: 'pure',
            position: 'top',
            duration: 3000,
            type: 'info',
            sticky: false,
            html: false
        });
    }
})();
