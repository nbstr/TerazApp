'use strict';

var geocoder = require('geocoder');
var request = require('request');
// var MultiGeocoder = require('multi-geocoder'),
//    Geocoder = new MultiGeocoder({ provider: 'google', coordorder: 'latlong' });
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
					spherical: true
					// query: {
					// 	name: {
					// 		$regex : ".*ink.*"
					// 	}
					// }
				}
			}
		], function (error, data) {
			console.log(data);
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
		    	var output_data = [], new_data = [];

		    	// IGNORE FIRST
		    	result.splice(0, 1);

		    	for (var line in result) {

		    		// IDENTIFICATION
		    		/*
					|	0  - ID
					|	1  - NAME*
					|	2  - TYPE
					|	3  - BLOCK
					|	4  - STREET*
					|	5  - NUMBER*
					|	6  - ZIP*
					|	7  - LAT*
					|	8  - LNG*
					|	9  - OPENING*
					|	10 - PHONE
					|	11 - MAIL
					|	12 - WEB
					|	13 - SITS
					|	14 - SUN_START*
					|	15 - SUN_END*
					|	16 - INFO
					|	17 - SPONSOR
		    		|	* REQUIRED FIELD
		    		*/

		    		// VALIDATION
		    		if(!result[line][ 1]){ continue; }
		    		if(!result[line][ 4]){ continue; }
		    		if(!result[line][ 5]){ continue; }
		    		if(!result[line][ 6]){ continue; }
		    		if(!result[line][ 7]){ continue; }
		    		if(!result[line][ 8]){ continue; }
		    		if(!result[line][ 9]){ continue; }
		    		if(!result[line][14]){ continue; }
		    		if(!result[line][15]){ continue; }

		    		// REGISTERY
		    		new_data = {
		    			name:result[line][1],
		    			loc:{
		    				lat:parseFloat(result[line][7]),
		    				lng:parseFloat(result[line][8])
		    			},
		    			address:{
		    				number:result[line][5],
		    				street:result[line][4],
		    				zip:result[line][6]
		    			},
		    			opening:result[line][9]
		    		};

		    		// FILTERS
		    		if (result[line][2]) { new_data.type = result[line][2]; }
		    		if (result[line][3]) { new_data.block = result[line][3]; }
		    		if (result[line][14]) { new_data.sun_start = result[line][14]; }
		    		if (result[line][15]) { new_data.sun_end = result[line][15]; }
		    		if (result[line][13]) { new_data.sits = result[line][13]; }
		    		if (result[line][16]) { new_data.info = result[line][16]; }
		    		if (result[line][17]) { new_data.sponsor = result[line][17]; }

		    		if (result[line][10]) {
		    			new_data.phone = result[line][10];
		    			// CLEAR PARASITES
		    		};
		    		if (result[line][12]) {
		    			new_data.web = result[line][12];
		    			// ADD HTTP IF NECESSARY
		    		}
		    		if (result[line][11]) {
		    			new_data.mail = result[line][11];
		    			// VALIDATE E-MAIL ADDRESS
		    		}

		    		output_data.push(new_data);
		    	}

		    	// STORE DATA
				
		    	store_models(output_data, 0);

		    	/* GEOCODE
		    	var address_list = [];
		    	for (var e in output_data) {
		    		address_list.push(output_data[e].address.number + ' ' + output_data[e].address.street + ' ' + output_data[e].address.zip);
		    	}

		    	Geocoder.geocode(address_list).then(function (res) {
			        resp(res, output_data);
			    });
				*/
		      
		    }
		    function store_models(DATA, index) {
		    	//
		    	if(index < DATA.length){
		    		var newTerrace = new Terrace(DATA[index]);

					newTerrace.save(function(err) {
						if (err) return res.json(400, err);
						store_models(DATA, index + 1);
					});
		    	}
		    	else{
		    		return res.json({success:true, data:DATA});
		    	}			
		    }
		    /*
		    function resp(google_list, objct) {

		    	var terraces_list = [];

		    	for (var i = objct.length - 1; i >= 0; i--) {
		    		
		    		if (google_list.features[i] != undefined) {
		    			if (google_list.features[i].geometry != undefined) {

			    			objct[i].loc = {
				    			lng:google_list.features[i].geometry.coordinates[1],
				    			lat:google_list.features[i].geometry.coordinates[0],
				    			test_number:google_list.features[i].properties.address_components[0].long_name
				    		};

				    		terraces_list.push(objct[i]);
			    		}
		    		}

		    	}

		    	return res.json(objct);
		    }
			*/
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

// WEATHER

exports.forecast = function(req, res) {
	// SET PARAMETERS
	var $p = {
		lng:req.param('lng') ? parseFloat(req.param('lng')) : 4.38,
		lat:req.param('lat') ? parseFloat(req.param('lat')) : 50.83
	};

	request('http://api.openweathermap.org/data/2.5/forecast?lat='+$p.lat+'&lon='+$p.lng+'&cnt=1&lang=fr&mode=json&units=metric', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//return res.json(JSON.parse(body));
			var $data = JSON.parse(body), $response = [];

			for (var i = 0; i < 4; i++) {
				$response.push({
					date:$data.list[i].dt_txt,
					time:$data.list[i].dt_txt.split(' ')[1].split(':')[0] + 'h',
					icon:$data.list[i].weather[0].icon + '.png',
					temp:(parseInt($data.list[i].main.temp)).toString() + '°'
				});
			};

			return res.json({error:false, data: $response});
		}
		else{
			return res.json({error:true, data:error});
		}
	})

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