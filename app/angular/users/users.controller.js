(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UsersController', UsersController);

    function UsersController($scope, SocketsFactory, ChatFactory, UsersFactory) {
        /* jshint validthis: true */
        var vm = this;

        vm.user = {};
        vm.users = [];
        vm.openChat = openChat;

        activate();

        function activate() {
            // Temporary Login
            SocketsFactory.emit('users:connect', { id: prompt('Enter user ID') }, function (user) {
                vm.user = user;
                vm.users = UsersFactory.getUsers();

                SocketsFactory.emit('rooms:index');
            });
        }

        function openChat(toId) {
            UsersFactory.resetUnread(toId);

            SocketsFactory.emit('rooms:openChat', { members: [vm.user.id, toId] }, function (room) {
                var toUser = vm.users.filter(function (user) { return user.id === toId; })[0];

                ChatFactory.loadChatRoom(room, toUser);
            });
        }
    }
})();