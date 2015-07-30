var models = require('../models/index');
var messageModel = models.messageModel;
var attachmentLib = require('../libraries/attachmentLibrary');

exports.get = function (req, res) {
    var query = messageModel.findOne({ _id: req.params.id, from_id: req.params.userId });

    query.exec(function (err, message) {
        if (err) return res.send({'error': err});
        if (!message) return res.send({'error': 'No message found'});

        if (!req.query.viewAttachment) {
            var entity = messageModel.toEntity(message);
            return res.send({success:'Successfully queried message', data:entity});
        };
        return attachmentLib.getAttachment({ params: { id: message.attachment }}, res);
    });
};

exports.create = function(req, res){
    var message = new messageModel({
        from_id    : req.params.userId,
        room_id    : req.params.roomId,
        connection : req.params.connection,
        body       : req.body.body,
        attachment : req.params.attachment
    });

    message.save(function (err) {
        if(err) return res.send({'error': err});
        
        var entity = messageModel.toEntity(message);
        res.send({success: 'New message created', data: {'message': entity}});
    });
};
