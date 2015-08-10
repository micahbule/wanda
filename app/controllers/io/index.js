module.exports = function (app) {
	var controller = {};

	controller.index = function (req) {
	    res.io.emit('home', { title: 'Express' });
	};

	return controller;
}
