// REQUIRED
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// DB CONFIG
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/terazapp", {native_parser:true});

// MODELS
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// ROUTES IMPORT
var routes = require('./routes/index');

// GENERATE APP
var app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ADD HEADERS
app.use(function (req, res, next) {

    // ALLOW CONNECTION
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // ALLOW METHODS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // ALLOW HEADERS
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // ALLOW COOKIES
    res.setHeader('Access-Control-Allow-Credentials', true);

    // NEXT
    next();
});

// DB ACCESS
app.use(function(req,res,next){
    req.db = db; // db accessible to our router
    next();
});

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
