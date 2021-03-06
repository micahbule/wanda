var mongoose = require('mongoose');

module.exports = function() {
    this.TYPES = [
        'email'
      , 'chat'
      , 'tyt'
      , 'voice'
      , 'sms'
    ];
    this.collection = 'users';
    
    this.schema = mongoose.Schema({
        username: String,
        first_name: String,
        last_name: String,
        date_created: { type: Date, default: Date.now },
        connection: [{ connection_type: { type: String, enum: TYPES }, value: String }]
    });
    
    this.schema.statics.toEntity = function(rawModel) {
        return {
            'id': rawModel._id,
            'username': rawModel.username,
            'first_name': rawModel.first_name,
            'last_name': rawModel.last_name,
            'date_created': rawModel.date_created,
            'connection': rawModel.connection
        };
    };
    
    return this;
}
