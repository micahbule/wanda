'use strict';

var _ = require('lodash');

module.exports = function(env) {
    return _.extend(
        require('./env/all'),
        require('./env/' + env) || {}
    );
};
