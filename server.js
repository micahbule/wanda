var express = require('express');
var expressPath = require('express-path');
var mongoose = require('mongoose');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var ENV = app.get('env') || 'development';
var config = require('./config')(ENV);
var dbURI = 'mongodb://' + config.db.server + '/' + config.db.name;

process.env.NODE_ENV = ENV;

mongoose.connect(dbURI);

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.use(express.static(path.join(__dirname, 'public')));

expressPath(app, 'routeMap');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var db = mongoose.connection;

db.on('connected', function() {
    console.log('Mongoose default connection open to ' + dbURI);
    require('./config/seed')();
});

db.on('error', function(err) { 
    console.log('Mongoose default connection error: ' + err);
});

db.on('disconnected', function () { 
    console.log('Mongoose default connection disconnected'); 
});

process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
});

module.exports = app;
