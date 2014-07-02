'use strict';

var terraces = require('./ctrl/terraces');

// APPLICATION ROUTES

module.exports = function(app) {

	// SERVER API ROUTES

	app.get('/api/terraces', terraces.around);
	// app.get('/api/geo', terraces.geocode);
	// app.post('/api/terraces', terraces.store);
	// app.get('/api/terraces/:id', terraces.get);

	// ALL UNDEFINED API ROUTES SHOULD RETURN A 404
	app.get('/api/*', function(req, res) {
		res.send(404);
	});

};