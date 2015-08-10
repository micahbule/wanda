(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UsersController', UsersController);

    function UsersController($scope, SocketsFactory, ChatFactory) {
        /* jshint validthis: true */
        var vm = this;

        vm.user = {};
        vm.users = [];
        vm.openChat = openChat;

        activate();

        function activate() {
            SocketsFactory.on('found users', function (data) {
                vm.users = data.users;
            });

            // Temporary Login
            SocketsFactory.emit('users:connect', { id: prompt('Enter user ID') }, function (user) {
                vm.user = user;

                SocketsFactory.emit('rooms:index');
            });

            SocketsFactory.on('user connected', function (data) {
                toggleUserStatus(data.user);
            });

            SocketsFactory.on('user disconnected', function (data) {
                toggleUserStatus(data.user);
            });
        }

        function openChat(toId) {
            SocketsFactory.emit('rooms:openChat', { members: [vm.user.id, toId] }, function (room) {
                var toUser = vm.users.filter(function (user) { return user.id === toId; })[0];

                ChatFactory.loadChatRoom(room, toUser);
            });
        }

        function toggleUserStatus(user) {
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].id === user.id) {
                    if (typeof(vm.users[i].online) === 'undefined') {
                        vm.users[i].online = true;
                    } else {
                        vm.users[i].online = vm.users[i].online ? false : true;
                    }
                    break;
                }
            }
        }
    }
})();