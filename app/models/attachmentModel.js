var mongoose = require('mongoose');
var fs = require('fs');

module.exports = function() {

    this.collection = 'attachments';

    this.schema = mongoose.Schema({
        link         : String,
        file_type    : String,
        date_created : { type: Date, default: Date.now }
    });

    this.schema.statics.toEntity = function(rawModel) {
        return {
            'id'           : rawModel._id,
            'link'         : rawModel.link,
            'file_type'    : rawModel.file_type,
            'date_created' : rawModel.date_created
        };
    };

    this.schema.pre('remove', function (next) {
        var attachment = this;
        //do not do this if there is no link
        if (!attachment.link) return next();

        fs.unlink(attachment.link, function (err) {
            if (err) {
                return next(err);
            } else {
                return next();
            }
        });
    });

    return this;
}