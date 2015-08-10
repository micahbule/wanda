(function () {
	'use strict';

	angular
		.module('sockets')
		.service('SocketsFactory', SocketsFactory);

	function SocketsFactory(socketFactory) {
		return socketFactory();
	}
})();