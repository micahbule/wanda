module.exports = function (app) {
    var controller = {};

    var models = require('../../models/index');
    var userModel = models.userModel;
    var sessionLib = require('../../libraries/sessionLibrary');

    var onlineUsers = [];

    controller.connect = function (req) {
        getUser(req.data.id, function (err, userEntity) {
            if (err) return req.io.emit('error', { error: err });
            if (Object.keys(userEntity).length == 0) return req.io.emit('error', { error: 'No user found' });

            req.session.user = userEntity;
            req.session.save(function () {
                onlineUsers.push(userEntity);
                req.io.respond(userEntity);
                req.io.broadcast('user connected', { user: userEntity });
                req.io.route('users:getOnlineUsers');
            });
        });
    }

    controller.disconnect = function (req) {
        for (var i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].id === req.session.user.id) {
                req.io.broadcast('user disconnected', { user: onlineUsers.splice(i, 1)[0] });
                break;
            }
        }
    }

    controller.getOnlineUsers = function (req) {
        req.io.emit('online users', onlineUsers.filter(function (user) { return user.id != req.data.id }));
    }

    controller.index = function (req) {
        var query = userModel.find();

        query.exec(function (err, users) {
            if(err) return req.io.emit('error', {'error': err});

            var entities = [];
            for (var i = users.length - 1; i >= 0; i--) {
                var entity = userModel.toEntity(users[i]);
                entities.push(entity);
            };

            req.io.emit('found users', {success:'Successfully queried users', data:entities});
        });
    };

    controller.get = function (req) {
        getUser(req.data.id, function (err, userEntity) {
            if(err) return req.io.emit('error', {'error': err});

            if(!userEntity) return req.io.emit('error', { error: 'No user found' });

            return req.io.respond({ success:'Successfully queried user', data: { 'user': userEntity }});
        });
    };

    controller.update = function(req){
        var queryParams = { _id: req.data.id };
        userModel.findOne(queryParams, function (err, user) {
            if(err) return req.io.emit('error', {'error': err});
            if (!user) return req.io.emit('error', {'error': 'No user found with that user id: '+ req.data.id});
            var params = {};
            for (var key in req.data) {
                if (req.data.hasOwnProperty(key)) params[key] = req.data[key];
            };

            delete params.date_created;
            delete params.connection;
            delete params.id;
            delete params.method;

            if (req.data.method) {
                var connections = user.connection;
                if (req.data.method == 'addConnection') {
                    connections.push({connection_type: req.data.connection_type, value: req.data.connection_value });
                };

                if (req.data.method == 'changeConnection') {
                    for (var i = connections.length - 1; i >= 0; i--) {
                        if (connections[i].connection_type == req.data.connection_type) connections[i].value = req.data.connection_value;
                    };
                };

                if (req.data.method == 'changeConnections') {
                    connections = req.data.connections;
                };

                params.connection = connections;
            };

            user.update({ $set: params },function (err) {
                if(err) return req.io.emit('error', {'error': err});
                console.log('User:', user);
                req.io.emit('updated user', {success: 'User with id ' + req.data.id + ' has been successfully updated'});
            });
        });
    };

    controller.create = function(req){
        var user = new userModel({
            username        : req.data.username,
            first_name      : req.data.first_name,
            last_name       : req.data.last_name,
            connection      : req.data.connection
        });

        user.save(function (err) {
            if(err) return req.io.emit('error', {'error': err});
            
            var entity = userModel.toEntity(user);
            req.io.emit('created user', {success: 'New user created', data: {'user': entity}});
        });
    };

    controller.logout = function (req){
        var session = req.params.session;

        session.remove(function (err, session) {
            if(err) return req.io.emit('error', {'error': err});
            req.io.emit('logged user out', {success: 'successfully logged out user ' + req.params.user.id});
        });
    };

    function getUser(id, callback) {
        userModel.findOne({ _id: id }, function (err, user) {
            if(err) return callback(err);

            if(!user) return callback(null, {});
            var entity = userModel.toEntity(user);

            return callback(null, entity);
        });
    }

    return controller;
}