'use strict';

var express = require('express'),
	path = require('path'),
	config = require('./config'),
	mongoStore = require('connect-mongo')(express);


// EXPRESS CONFIGURATION

module.exports = function(app) {
	app.configure('development', function(){

		// DISABLE CACHING OF SCRIPTS FOR EASIER TESTING
		app.use(function noCache(req, res, next) {
			if (req.url.indexOf('/scripts/') === 0) {
				res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
				res.header('Pragma', 'no-cache');
				res.header('Expires', 0);
			}
			next();
		});

	});

	app.configure('production', function(){

		//
		
	});

	app.configure(function(){
		app.use(express.compress());
		app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
		app.use(express.static(path.join(config.root, 'root')));
		app.set('views', config.root + '/public/html');

		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');
		app.use(express.logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.methodOverride());
		app.use(express.cookieParser());

		// PERSIST SESSIONS WITH MONGOSTORE
		// app.use(express.session({
		// 	secret: 'teraz-app secret',
		// 	store: new mongoStore({
		// 		url: config.mongo.uri,
		// 		collection: 'sessions'
		// 	}, function () {
		// 			console.log("db connection open");
		// 	})
		// }));
		
		// ROUTER (ONLY ERROR HANDLERS SHOULD COME AFTER THIS)
		app.use(app.router);

		// PROCESS WWW
		app.get('/*', function(req, res, next) {
			if (req.headers.host.match(/^www/) !== null ) {
				res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
			} else {
				next();     
			}
		});

	});
	
	// app.configure('production', function(){
	// 	// SEO OPTIMIZATION
	// 	app.use(require('prerender-node').set('prerenderToken', 'yEJq1AO51W1NqVQWpWHL'));
	// });


	// ERROR HANDLER
	app.configure('development', function(){
		app.use(express.errorHandler());
	});
};