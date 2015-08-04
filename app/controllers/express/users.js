var models = require('../../models/index');
var userModel = models.userModel;
var sessionLib = require('../../libraries/sessionLibrary');

exports.index = function (req, res) {
    var query = userModel.find();

    query.exec(function (err, users) {
        if(err) return res.send({'error': err});

        var entities = [];
        for (var i = users.length - 1; i >= 0; i--) {
            var entity = userModel.toEntity(users[i]);
            entities.push(entity);
        };

        res.send({success:'Successfully queried users', data:entities});
    });
};

exports.get = function (req, res) {
    userModel.findOne({ _id: req.params.id }, function (err, user) {
        if(err) return res.send({'error': err});

        if(!user) return res.send({});
        var entity = userModel.toEntity(user);

        return res.send({success:'Successfully queried user', data: {'user': entity}});
    });
};

exports.update = function(req, res){
    var queryParams = { _id: req.params.id };
    userModel.findOne(queryParams, function (err, user) {
        if(err) return res.send({'error': err});
        if (!user) return res.send({'error': 'No user found with that user id: '+ req.params.id});
        var params = {};
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) params[key] = req.body[key];
        };

        delete params.date_created;
        delete params.connection;

        if (req.query.method) {
            var connections = user.connection;
            if (req.query.method == 'addConnection') {
                connections.push({connection_type: req.body.connection_type, value: req.body.connection_value });
            };

            if (req.query.method == 'changeConnection') {
                for (var i = connections.length - 1; i >= 0; i--) {
                    if (connections[i].connection_type == req.body.connection_type) connections[i].value = req.body.connection_value;
                };
            };

            if (req.query.method == 'changeConnections') {
                connections = req.body.connections;
            };

            params.connection = connections;
        };

        user.update({ $set: params },function (err) {
            if(err) return res.send({'error': err});
            console.log('User:', user);
            res.send({success: 'User with id ' + req.params.id + ' has been successfully updated'});
        });
    });
};

exports.create = function(req, res){
    var user = new userModel({
        username        : req.body.username,
        first_name      : req.body.first_name,
        last_name       : req.body.last_name,
        connection      : req.body.connection
    });

    user.save(function (err) {
        if(err) return res.send({'error': err});
        
        var entity = userModel.toEntity(user);
        res.send({success: 'New user created', data: {'user': entity}});
    });
};

exports.logout = function (req, res){
    var session = req.params.session;

    session.remove(function (err, session) {
        if(err) return res.send({'error': err});
        res.send({success: 'successfully logged out user ' + req.params.user.id});
    });
};
