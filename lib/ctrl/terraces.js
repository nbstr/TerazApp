'use strict';

var geocoder = require('geocoder');
var fs = require('fs');
var formidable = require('formidable');
var tsv = require("node-tsv-json");
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

	function terraces_around (radius){
		Terrace.aggregate([
			{
				$geoNear:{
					near: {
	 					type:"Point",
						coordinates : [$p.lng, $p.lat]
					},
					distanceField: "loc.distance",
					limit: $p.limit,
					maxDistance: radius,
					spherical: true,
					// query: {
					// 	name: {
					// 		$regex : ".*ink.*"
					// 	}
					// }
				}
			}
		], function (error, data) {
			console.log(data.length);
	 		if (error) {
	 			console.log({
		 			error:error,
		 			data:data
		 		});
	 			return res.json(error);
	 		}
	 		if (data.length < 3 && radius < $p.radius + 500 * 5) {
				terraces_around (radius + 500);
			}
			else if (data.length < 3 && radius >= $p.radius + 500 * 5 && radius < $p.radius + 1000 * 5 + 500 * 5) {
				terraces_around (radius + 1000);
			}
			else if (data.length < 3 && radius >= $p.radius + 40000000) {
				terraces_around (radius * 2);
			}
			else {
				res.json(data);
			}
	 	});
	}
	terraces_around ($p.radius);

};

// IMPORT TSV FILE

exports.tsv = function(req, res) {

	var form = new formidable.IncomingForm;

    form.keepExtensions = true;
    form.uploadDir = 'public/uploads';
 
    form.parse(req, function(err, fields, files){

    	if (err) return res.end('There is a problem with the file');

		// PROCESS FILE
		tsv({
		    input: files.file.path, 
		    output: "public/uploads/output.json",
		    parseRows: true
		}, function(error, result){

		    if(error) {
		      console.error(error);
		    }
		    else {
		    	// PROCESS DATA
		    	var output_data = [];

		    	for (var line in result) {
		    		// VALIDATION
		    		if(!result[line][1] || !result[line][4] || !result[line][5] || !result[line][6]){ continue;} // NAME, STREET, NUMBER, ZIP

		    		// REGISTERY
		    		output_data.push({
		    			name:result[line][1],
		    			address:{
		    				number:result[line][5],
		    				street:result[line][4],
		    				zip:result[line][6]
		    			},
		    			type:result[line][2],
		    			block:result[line][3],
		    			phone : result[line][8],
						mail : result[line][9],
						web : result[line][10],
						sun_start : result[line][12],
						sun_end : result[line][13],
						sits : result[line][11],
						info : result[line][14],
						opening : result[line][7]
		    		});

		    	}
		      	
		      	return res.json(output_data);
		    }

		});

    });
 
    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log(bytesReceived + ' ' + bytesExpected);
    });
 
    form.on('error', function(err) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
    });

    return;

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