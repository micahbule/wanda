module.exports = function (app) {
    var controller = {};

    var models = require('../../models/index');
    var roomModel = models.roomModel;
    var messageModel = models.messageModel;
    var messageLibrary = require('../../libraries/messageLibrary');
    var async = require('async');

    controller.index = function (req) {
        var query = roomModel.find({ members: req.session.user.id });

        query.exec(function (err, rooms) {
            if (err) return req.io.emit('error', {'error': err});

            var entities = [];
            for (var i = rooms.length - 1; i >= 0; i--) {
                var entity = roomModel.toEntity(rooms[i]);

                req.io.join(entity.id);

                retrieveMessages(entity.id, 20, function (err, messages) {
                    if (err) return req.io.emit('error', {'error': err});
                    entity.messages = messages;
                    entities.push(entity);

                    if (entities.length == rooms.length) req.io.emit('found rooms', {success:'Successfully queried rooms', data:entities});
                });
            };
        });
    };

    controller.openChat = function (req) {
        var query = roomModel.findOne({ members: { $all: req.data.members } });

        query.exec(function (err, room) {
            if (err) return req.io.emit('error', {'error': err});
            if (!room) return req.io.route('rooms:create');

            var entity = roomModel.toEntity(room);
            retrieveMessages(entity.id, req.data.limit || 20, function (err, messages) {
                if (err) return req.io.emit('error', {'error': err});
                entity.messages = messages;

                req.io.respond(entity);
            });
        });
    }

    controller.get = function (req) {
        var query = roomModel.findOne({ members: req.data.userId, _id: req.data.id });

        query.exec(function (err, room) {
            if (err) return req.io.emit('error', {'error': err});
            if (!room) return req.io.emit('error', {'error': 'No room found'});

            var entity = roomModel.toEntity(room);
            retrieveMessages(entity.id, req.data.limit || 20, function (err, messages) {
                if (err) return req.io.emit('error', {'error': err});
                entity.messages = messages;

                req.io.emit('found room', {success:'Successfully queried room', data:entity});
            });
        });
    };

    controller.create = function(req){
        var room = new roomModel({
            members : req.data.members,
            name    : req.data.name
        });

        room.save(function (err) {
            if(err) return req.io.emit('error', {'error': err});
            
            var entity = roomModel.toEntity(room);
            req.io.join(entity.id);
            req.io.respond(entity);
            req.io.emit('created room', {success: 'New room created', data: {'room': entity}});
        });
    };

    controller.update = function(req){
        var queryParams = { members: req.params.userId, _id: req.params.id };
        roomModel.findOne(queryParams, function (err, room) {
            if(err) return req.io.emit('error', {'error': err});
            if (!room) return req.io.emit('error', {'error': 'No room found with that room id: '+ req.params.id});
            var params = {};
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) params[key] = req.body[key];
            };

            delete params.date_created;
            delete params.members;

            if (req.query.method) {
                var members = room.members;
                if (req.query.method == 'addMembers') {
                    for (var i = 0; i < req.params.additional_members.length; i++) {
                        members.push(req.params.additional_members[i]);
                    };
                };

                if (req.query.method == 'removeMember') {
                    members = members.filter(function (e) { return e != req.params.removable_member; });
                };

                if (req.query.method == 'changeMembers') {
                    members = req.params.members;
                };

                params.members = members;
            };

            room.update({ $set: params },function (err) {
                if(err) return req.io.emit('error', {'error': err});
                console.log('Room:', room);
                req.io.emit('updated room', {success: 'Room with id ' + req.params.id + ' has been successfully updated'});
            });
        });
    };

    var retrieveMessages = function (roomId, limit, callback) {
        var query = messageModel.find({ room_id: roomId });
        if (limit) query.limit(limit);
        query.sort({ date_created: 'desc' });
        query.exec(function (err, messages) {
            if (err) return callback(err);
            if (!messages || messages.length == 0) return callback();

            var entities = [];
            for (var i = messages.length - 1; i >= 0; i--) {
                var entity = messageModel.toEntity(messages[i]);
                entities.push(entity);
            };

            async.map(entities, messageLibrary.attachSender, function (err, updatedEntities) {
                if (err) return callback(err);

                callback(null, updatedEntities);
            });

        });
    };

    return controller;
}