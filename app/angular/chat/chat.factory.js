(function () {
	'use strict';

	angular
		.module('app.chat')
		.factory('ChatFactory', ChatFactory);

	function ChatFactory(SocketsFactory) {
		var factory = {
			loadChatRoom: loadChatRoom,
			getLoadedChatRoom: getLoadedChatRoom,
			sendMessage: sendMessage
		};

		var loadedChatRoom = {};

		function loadChatRoom(room, toUser) {
			if (!room.name && toUser) room.name = toUser.username;

			for (var key in room) {
				loadedChatRoom[key] = room[key];
			}
		}

		function getLoadedChatRoom() {
			return loadedChatRoom;
		}

		function sendMessage(message) {
			SocketsFactory.emit('messages:create', { room: loadedChatRoom, message: message });
		}

		return factory;
	}
})();