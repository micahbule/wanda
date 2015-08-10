(function () {
	'use strict';

	angular
		.module('app.chat')
		.controller('ChatController', ChatController);

	function ChatController(ChatFactory, SocketsFactory) {
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
				if (Object.keys(vm.chatRoom).length > 0) {
					vm.chatRoom.messages.push(data.message);
					$('.comments .comment:last-child').scrollTop($('.comments .comment:last-child')[0].scrollHeight);
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