'use strict';

var terraces = require('./ctrl/terraces');

// APPLICATION ROUTES

module.exports = function(app) {

	// SERVER API ROUTES

	app.get('/api/terraces', terraces.around);
	app.get('/api/geo', terraces.geocode);
	app.get('/api/forecast', terraces.forecast);

	app.post('/api/tsv', terraces.tsv);
	app.post('/api/terraces', terraces.store);

	// ALL UNDEFINED API ROUTES SHOULD RETURN A 404
	app.get('/api/*', function(req, res) {
		res.send(404);
	});

};