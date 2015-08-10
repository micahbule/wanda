(function () {
    'use strict';

    angular
        .module('app.users')
        .factory('UsersFactory', UsersFactory);

    function UsersFactory(SocketsFactory) {
        var factory = {
            getUsers: getUsers,
            addUnread: addUnread,
            resetUnread: resetUnread
        };

        var users = [];

        activate();

        function activate() {
            SocketsFactory.on('found users', function (data) {
                async.map(data.users, attachUnreadCounter, function (err, modifiedUsers) {
                    console.log('Finished adding counters');
                });
            });

            SocketsFactory.on('user connected', function (data) {
                toggleUserStatus(data.user);
            });

            SocketsFactory.on('user disconnected', function (data) {
                toggleUserStatus(data.user);
            });
        }

        function getUsers() {
            return users;
        }

        function toggleUserStatus(user) {
            var userToToggle = getUser(user.id);

            if (typeof(userToToggle.online) === 'undefined') {
                userToToggle.online = true;
            } else {
                userToToggle.online = user.online ? false : true;
            }
        }

        function addUnread(id) {
            var user = getUser(id);

            user.unread++;
        }

        function resetUnread(id) {
            var user = getUser(id);

            user.unread = 0;
        }

        function attachUnreadCounter(user, callback) {
            user.unread = 0;
            users.push(user);
            callback(null, user);
        }

        function getUser(id) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    return users[i];
                }
            }
        }

        return factory;
    }
})();