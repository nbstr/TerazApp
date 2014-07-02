'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'),
    Teraz = mongoose.model('Teraz');

// GET TERAZ
router.get('/teraz', function(req, res) {
	var limit = req.param('limit') ? req.param('limit') : 10 ;
	// return Teraz.find({}, function (err, data) {
	// 	if (!err) {
	// 		return res.json(data);
	// 	} else {
	// 		return res.send(err);
	// 	}
	// });

	var db = req.db;
 	// db.collection('teraz').find({
 	// 	loc: { $near : [4.382596, 50.839815] }
 	// }).toArray(function (error, items) {
 	//     res.json(items);
 	// });

 	db.collection('teraz').find({
 		loc : { $geoWithin :
	             { $centerSphere :
	                [ [ 4.382596 , 50.839815 ] , 39599 ]
	  } } } ).toArray(function (error, items) {
 	    res.json(items);
 	});

});

// CREATE TERAZ
router.post('/teraz', function(req, res) {
	console.log(req.body);
	var newTeraz = new Teraz(req.body);

	newTeraz.save(function(err) {
		if (err) return res.json(400, err);
		console.log(newTeraz);
		return res.json(newTeraz);
	});

});

module.exports = router;
