var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function (app, opt) {
	var controllersPath = './' + (opt && opt.controllersPath ? opt.controllersPath : 'app/controllers/io');

	var controllers = fs.readdirSync(controllersPath);

	async.each(controllers, loadControllers, function (err) {
		if (err) console.log(err);
	});

	function loadControllers(controller, callback) {
		var controllerName = controller.split('.')[0];

		var controllerObj = require(path.join(path.resolve(controllersPath), controllerName));

		app.io.route(controllerName, controllerObj);

		callback();
	}
}