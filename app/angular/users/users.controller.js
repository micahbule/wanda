(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UsersController', UsersController);

    function UsersController($scope, SocketsFactory, ChatFactory) {
        /* jshint validthis: true */
        var vm = this;

        vm.user = {};
        vm.onlineUsers = [];
        vm.openChat = openChat;

        activate();

        function activate() {
            SocketsFactory.on('online users', function (onlineUsers) {
                vm.onlineUsers = onlineUsers;
            });

            // Temporary Login
            SocketsFactory.emit('users:connect', { id: prompt('Enter user ID') }, function (user) {
                vm.user = user;

                SocketsFactory.emit('rooms:index');
            });

            SocketsFactory.on('user connected', function (data) {
                vm.onlineUsers.push(data.user);
            });

            SocketsFactory.on('user disconnected', function (data) {
                var user = data.user;
                for (var i = 0; i < vm.onlineUsers.length; i++) {
                    if (vm.onlineUsers[i].id === user.id) {
                        var disconnectedUser = vm.onlineUsers.splice(i, 1)[0];
                        break;
                    }
                }
            });
        }

        function openChat(toId) {
            SocketsFactory.emit('rooms:openChat', { members: [vm.user.id, toId] }, function (room) {
                var toUser = vm.onlineUsers.filter(function (user) { return user.id === toId; })[0];

                ChatFactory.loadChatRoom(room, toUser);
            });
        }
    }
})();