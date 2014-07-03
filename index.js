'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

// MAIN APP FILE

// SET DEFAULT NODE ENVIRONMENT TO DEVELOPMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// APPLICATION CONFIG
var config = require('./lib/config/config');

// CONNECT TO DATABASE
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// BOOTSTRAP MODELS
var m_p = path.join(__dirname, 'lib/mod');
	fs.readdirSync(m_p).forEach(function (file) {
		if (/(.*)\.(js$|coffee$)/.test(file)) {
			require(m_p + '/' + file);
		}
});

var app = express();

// EXPRESS SETTINGS
require('./lib/config/express')(app);

// ROUTING
require('./lib/routes')(app);

// START SERVER
app.listen(config.port, function () {
	console.log('TerazApp API server listening on port %d in %s mode', config.port, app.get('env'));
});

// EXPOSE APP
exports = module.exports = app;