var models = require('../models/index');
var userModel = models.userModel;

exports.beforeCreate = function (req, res, next) {
    if (!req.body.members) return res.send({error: 'Cannot create a room without members'});
    req.params.members = [];
    for (var i = 0; i < req.body.members.length; i++) {
        verifyUser(req.body.members[i], function (err, userId) {
            if (err) return res.send({error:err});
            req.params.members.push(userId);

            if (req.params.members.length == req.body.members.length) return next();
        });
    };
};

exports.beforeUpdate = function (req, res, next) {
    if (!req.query.method) return next();

    if (req.query.method == 'addMembers') {
        req.params.additional_members = [];
        if (!req.body.additional_members || req.body.additional_members.length == 0) return res.send({error: 'No additional members to add'});
        for (var i = 0; i < req.body.additional_members.length; i++) {
            verifyUser(req.body.additional_members[i], function (err, userId) {
                if (err) return res.send({error:err});
                req.params.additional_members.push(userId);

                if (req.params.additional_members.length == req.body.additional_members.length) return next();
            });
        };
    } else if (req.query.method == 'removeMember') {
        if (!req.body.removable_member) return res.send({error: 'No removable member to remove'});
        verifyUser(req.body.removable_member, function (err, userId) {
            if (err) return res.send({error:err});
            return next();
        });
    } else if (req.query.method == 'changeMembers') {
        req.params.members = [];
        if (!req.body.members || req.body.members.length == 0) return res.send({error: 'No members to change'});
        for (var i = 0; i < req.body.members.length; i++) {
            verifyUser(req.body.members[i], function (err, userId) {
                if (err) return res.send({error:err});
                req.params.members.push(userId);

                if (req.params.members.length == req.body.members.length) return next();
            });
        };
    } else {
        return res.send({error: 'No method ' + req.query.method + ' found'});
    };
};

var verifyUser = function (userId, callback) {
    userModel.findOne({ _id: req.body.members[i] }, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback('Could not find user with id ' + userId);
        callback(null, userId);
    });
};