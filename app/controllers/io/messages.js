module.exports = function (app) {
    var controller = {};

    var models = require('../../models/index');
    var messageModel = models.messageModel;
    var attachmentLib = require('../../libraries/attachmentLibrary');

    controller.get = function (req) {
        var query = messageModel.findOne({ _id: req.params.id, from_id: req.params.userId });

        query.exec(function (err, message) {
            if (err) return req.io.emit('error', {'error': err});
            if (!message) return req.io.emit('error', {'error': 'No message found'});

            if (!req.query.viewAttachment) {
                var entity = messageModel.toEntity(message);
                return req.io.emit('found message', {success:'Successfully queried message', data:entity});
            };
            return attachmentLib.getAttachment({ params: { id: message.attachment }}, res);
        });
    };

    controller.create = function(req){
        var message = new messageModel({
            from_id    : req.session.user.id,
            room_id    : req.data.room.id,
            connection : req.session.user.connection[0],
            body       : req.data.message
            // attachment : req.params.attachment
        });

        message.save(function (err) {
            if(err) return req.io.emit('error', {'error': err});
            
            var entity = messageModel.toEntity(message);
            entity.sender = req.session.user;
            app.io.room(req.data.room.id).broadcast('message broadcasted', { room: req.data.room, message: entity });
            req.io.emit('created message', {success: 'New message created', data: {'message': entity}});
        });
    };

    controller.update = function(req){
        var queryParams = { _id: req.params.id, from_id: req.params.userId };
        messageModel.findOne(queryParams, function (err, message) {
            if(err) return req.io.emit('error', {'error': err});
            if (!message) return req.io.emit('error', {'error': 'No message found with that message id: '+ req.params.id});
            var params = {};
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) params[key] = req.body[key];
            };

            delete params.date_created;
            delete params.from_id;
            delete params.room_id;
            delete params.connection;

            params.date_edited = new Date();

            message.update({ $set: params },function (err) {
                if(err) return req.io.emit('error', {'error': err});
                console.log('Message:', message);
                req.io.emit('updated message', {success: 'Message with id ' + req.params.id + ' has been successfully updated'});
            });
        });
    };

    return controller;
}