(function () {
	'use strict';

	angular
		.module('app.chat')
		.controller('ChatController', ChatController);

	function ChatController(ChatFactory, SocketsFactory, UsersFactory) {
		/* jshint validthis: true */
		var vm = this;

		vm.chatRoom = {};
		vm.sendMessage = sendMessage;
		vm.getHash = getHash;
		vm.message = '';
			
		activate();

		function activate() {
			vm.chatRoom = ChatFactory.getLoadedChatRoom();

			SocketsFactory.on('message broadcasted', function (data) {
				console.log('broadcasted!');
				if (Object.keys(vm.chatRoom).length > 0 && vm.chatRoom.id === data.room.id) {
					console.log('here?');
					if (!vm.chatRoom.messages) vm.chatRoom.messages = [];
					vm.chatRoom.messages.push(data.message);
					$('.comments .comment:last-child').scrollTop($('.comments .comment:last-child')[0].scrollHeight);
				} else {
					console.log('there?');
					UsersFactory.addUnread(data.message.from_id);
				}
			});
		}

		function sendMessage() {
			if (vm.message !== '') {
				ChatFactory.sendMessage(vm.message);
				vm.message = '';
			}
		}

		function getHash(id) {
			return 'photo-bg' + parseInt(id, 36).toString()[0];
		}
	}
})();