'use strict';

var mongoose = require('mongoose'),
    Terrace = mongoose.model('Terrace');

// GET TERRACES AROUND

exports.around = function(req, res) {
	// SET PARAMETERS
	var $p = {
		lng:req.param('lng') ? req.param('lng') : 4.38,
		lat:req.param('lat') ? req.param('lat') : 50.83,
		limit:req.param('limit') ? req.param('limit') : 10,
		radius:req.param('radius') ? req.param('radius') : 1000
	};

 	Terrace.find({
 		loc:{
 			$near:{
 				$geometry:{
 					type:"Point",
					coordinates : [$p.lng, $p.lat]
				},
				$maxDistance : $p.radius
			}
        }
 	}, function (error, items) {
 	    res.json(items);
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