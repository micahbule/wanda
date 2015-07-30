var models = require('../models/index');
var userModel = models.userModel;
var roomModel = models.roomModel;

exports.beforeCreate = function (req, res, next) {
    if (!req.params.userId) return res.send({error: 'Cannot create a message without a user'});
    if (!req.params.roomId) return res.send({error: 'Cannot create a message without a room'});
    var connection = { value: req.body.connection_value, connection_type: req.body.connection_type }; // not sure if this will work though :/
    userModel.findOne({ _id: req.params.userId, connection: connection }, function (err, user) {
        if (err) return res.send({error:err});
        if (!user) return res.send({error: 'Cannot create a message without a user'});

        roomModel.findOne({ _id: req.params.roomId, members: req.params.userId }, function (err, room) {
            if (err) return res.send({error:err});
            if (!room) return res.send({error: 'Cannot create a message without a room'});

            req.params.connection = connection;
        });
    });
};
