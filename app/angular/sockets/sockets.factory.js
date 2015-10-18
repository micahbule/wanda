(function () {
	'use strict';

	angular
		.module('sockets')
		.service('SocketsFactory', SocketsFactory);

	function SocketsFactory(socketFactory) {
		var socket = io.connect('http://localhost:3000');
		return socketFactory({ ioSocket: socket });
	}
})();