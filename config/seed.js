var models = require('../app/models/index');

module.exports = function () {
    var userModel = models.userModel;
    var user = new userModel({
        username: 'admin',
        password: 'admin',
        first_name: 'Cynder',
        last_name: 'Administrator'
    });
    
    userModel.findOne({ username: 'admin' }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            if (!data) {
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
}
