'use strict';

var geocoder = require('geocoder');

var mongoose = require('mongoose'),
    Terrace = mongoose.model('Terrace');

// GET TERRACES AROUND

exports.around = function(req, res) {
	// SET PARAMETERS
	var $p = {
		lng:req.param('lng') ? parseFloat(req.param('lng')) : 4.38,
		lat:req.param('lat') ? parseFloat(req.param('lat')) : 50.83,
		limit:req.param('limit') ? parseInt(req.param('limit')) : 10,
		radius:req.param('radius') ? parseFloat(req.param('radius')) : 1000
	};

	Terrace.aggregate([
		{
			$geoNear:{
				near: {
 					type:"Point",
					coordinates : [$p.lng, $p.lat]
				},
				distanceField: "loc.distance",
				limit: $p.limit,
				maxDistance: $p.radius,
				spherical: true,
			}
		}
	], function (error, data) {
 		if (error) {
 			console.log({
	 			error:error,
	 			data:data
	 		});
 			return res.json(error);
 		}
 	    res.json(data);
 	});

};

// GEOCODE

exports.geocode = function(req, res) {
	// SET PARAMETERS
	var $p = {
		address:req.param('address') ? req.param('address') : 'Atlanta, GA'
	};

	// GEOCODING
	geocoder.geocode($p.address, function (error, data) {
		if (error) {
 			console.log({
	 			error:error,
	 			data:data
	 		});
 			return res.json(error);
 		}
 		console.log(data);

 		var coordinates = {
 			lng:data.results[0].geometry.location.lng,
 			lat:data.results[0].geometry.location.lat
 		};
		return res.json(coordinates);
	});

};

// CREATE NEW TERRACE

exports.store = function(req, res, next) {
	// SET PARAMETERS
	var newTerrace = new Terrace(req.body);

	newTerrace.save(function(err) {
		if (err) return res.json(400, err);
		return res.json(newTerrace);
	});
};