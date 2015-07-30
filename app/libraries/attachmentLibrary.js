var models = require('../models/index');
var attachmentModel = models.attachmentModel;
var path = require('path');
var Q = require('q');

exports.getAttachment = function(req, res) {
    attachmentModel.findOne({ _id: req.params.id }, function (err, attachment) {
        if(err) return res.send({'error':err});
        if(!attachment) return res.send({'error': 'No Attachment Found'});
        
        res.sendfile(path.resolve(attachment.link));
    });
};

exports.getAttachmentEntity = function(req, res) {
    attachmentModel.findOne({ _id: req.params.id }, function (err, attachment) {
        if(err) return res.send({'error':err});
        if(!attachment) return res.send({'error': 'No Attachment Found'});
        
        var entity = attachmentModel.toEntity(attachment);
        res.send({success: 'Attachment found', data:entity});
    });
};

exports.convertToAttachments = function (files, callback) {
    if (!files || !files[0] || files.length == 0 || typeof files === 'undefined') return callback();
    var attachmentProcess = Q.defer();
    var attachments = [];

    for (var i = 0; i < files.length; i++) {
        var attachment = new attachmentModel({
                link: files[i].link
            , file_type: files[i].file_type
        });

        attachment.save(function (err, attachment) {
            if (err) return attachmentProcess.reject(err);
            
            attachments.push(attachment);
            if (attachments.length == files.length) attachmentProcess.resolve();
        });
    };

    attachmentProcess.promise.then(function () {
        callback(null, attachments);
    }, function (err) {
        callback(err);
    });
};

exports.unlinkAttachments = function (files, callback) {
    var attachmentProcess = Q.defer();
    var fileSize = files.length;
    var counter = 0;
    for (var i = 0; i < files.length; i++) {
        files[i].remove(function (err) {
            if (err) return attachmentProcess.reject(err);
            
            if (++counter == fileSize) attachmentProcess.resolve();
        }); 
    };

    attachmentProcess.promise.then(function () {
        callback(null);
    }, function (err) {
        callback(err);
    });
};