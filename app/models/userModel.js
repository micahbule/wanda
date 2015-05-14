var mongoose = require('mongoose');

module.exports = function() {
    this.collection = 'user';
    
    this.schema = mongoose.Schema({
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        date_created: { type: Date, default: Date.now }
    });
    
    this.schema.statics.toEntity = function(rawModel) {
        return {
            'id': rawModel._id,
            'username': rawModel.username,
            'first_name': rawModel.first_name,
            'last_name': rawModel.last_name,
            'date_created': rawModel.date_created
        };
    };
    
    return this;
}
