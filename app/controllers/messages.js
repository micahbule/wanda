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