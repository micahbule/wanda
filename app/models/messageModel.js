var mongoose = require('mongoose');

module.exports = function() {
    this.TYPES = [
        'email'
      , 'chat'
      , 'tyt'
      , 'voice'
      , 'sms'
    ];
    this.collection = 'messages';
    
    this.schema = mongoose.Schema({
        date_created: { type: Date, default: Date.now },
        from_id: String,
        room_id: String,
        connection: { connection_type: { type: String, enum: TYPES }, value: String },
        body: String,
        attachment: String,
        date_edited: Date
    });
    
    this.schema.statics.toEntity = function(rawModel) {
        return {
            'id': rawModel._id,
            'from_id': rawModel.from_id,
            'room_id': rawModel.room_id,
            'date_created': rawModel.date_created,
            'connection': rawModel.connection,
            'body': rawModel.body,
            'attachment': rawModel.attachment,
            'date_edited': rawModel.date_edited
        };
    };
    
    return this;
}
