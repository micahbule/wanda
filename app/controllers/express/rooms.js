var models = require('../../models/index');
var roomModel = models.roomModel;
var messageModel = models.messageModel;

exports.index = function (req, res) {
    var query = roomModel.find({ members: req.params.userId });

    query.exec(function (err, rooms) {
        if (err) return res.send({'error': err});

        var entities = [];
        for (var i = rooms.length - 1; i >= 0; i--) {
            var entity = roomModel.toEntity(rooms[i]);
            retrieveMessages(entity.id, 20, function (err, messages) {
                if (err) return res.send({'error': err});
                entity.messages = messages;
                entities.push(entity);

                if (entities.length == rooms.length) res.send({success:'Successfully queried rooms', data:entities});
            });
        };
    });
};

exports.get = function (req, res) {
    var query = roomModel.findOne({ members: req.params.userId, _id: req.params.id });

    query.exec(function (err, room) {
        if (err) return res.send({'error': err});
        if (!room) return res.send({'error': 'No room found'});

        var entity = roomModel.toEntity(room);
        retrieveMessages(entity.id, req.query.limit || 20, function (err, messages) {
            if (err) return res.send({'error': err});
            entity.messages = messages;

            res.send({success:'Successfully queried room', data:entity});
        });
    });
};

exports.create = function(req, res){
    var room = new roomModel({
        members : req.params.members,
        name    : req.body.name
    });

    room.save(function (err) {
        if(err) return res.send({'error': err});
        
        var entity = roomModel.toEntity(room);
        res.send({success: 'New room created', data: {'room': entity}});
    });
};

exports.update = function(req, res){
    var queryParams = { members: req.params.userId, _id: req.params.id };
    roomModel.findOne(queryParams, function (err, room) {
        if(err) return res.send({'error': err});
        if (!room) return res.send({'error': 'No room found with that room id: '+ req.params.id});
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
            if(err) return res.send({'error': err});
            console.log('Room:', room);
            res.send({success: 'Room with id ' + req.params.id + ' has been successfully updated'});
        });
    });
};

var retrieveMessages = function (roomId, limit, callback) {
    var query = messageModel.find({ room_id: roomId });
    if (limit) query.limit(limit);
    query.exec(function (err, messages) {
        if (err) return callback(err);
        if (!messages || messages.length == 0) return callback();

        var entities = [];
        for (var i = messages.length - 1; i >= 0; i--) {
            var entity = messageModel.toEntity(messages[i]);
            entities.push(entity);
        };

        callback(null, entities);
    });
};