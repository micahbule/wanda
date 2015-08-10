var models = require('../models/index');
var userModel = models.userModel;

exports.attachSender = function (message, callback) {
    var query = userModel.findOne({ _id: message.from_id });

    query.exec(function (err, user) {
        if (err) return callback(err);

        message.sender = user;

        callback(null, message);
    });
}