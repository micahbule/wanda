var mongoose = require('mongoose');

module.exports = function() {
    this.collection = 'rooms';
    
    this.schema = mongoose.Schema({
        date_created: { type: Date, default: Date.now },
        members: [ String ],
        name: String
    });
    
    this.schema.statics.toEntity = function(rawModel) {
        return {
            'id': rawModel._id,
            'name': rawModel.name,
            'date_created': rawModel.date_created,
            'members': rawModel.members
        };
    };
    
    return this;
}
