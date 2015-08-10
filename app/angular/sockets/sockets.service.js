(function () {
	'use strict';

	angular
		.module('sockets')
		.service('SocketsService', SocketsService);

	function SocketsService(ngNotify, SocketsFactory) {
		var factory = {
			getUsers: getUsers,
			createUser: createUser
		};

		function getUsers(callback) {
			SocketsFactory.emit('users:index');

			SocketsFactory.on('found users', function (data) {
				callback(data.data);
			});
		}

		function createUser(newUser, callback) {
			SocketsFactory.emit('users:create', newUser);

			SocketsFactory.on('created user', function (data) {
				ngNotify.set(data.success, {
					type: 'success'
				});

				callback(data.data.user);
			});
		}

		return factory;
	}
})();