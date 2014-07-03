'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// TERRACE MODEL

var TerraceSchema = new Schema({
	name : {type: String, required: true},
	type : {type: String, required: false},
	block : {type: String, required: false},
	loc: { type: {}, index: '2dsphere', sparse: true },
	address:{
		street : {type: String, required: true},
		number : {type: String, required: true},
		zip : {type: String, required: true}
	},
	phone : {type: String, required: false},
	mail : {type: String, required: false},
	web : {type: String, required: false},
	sun_start : {type: String, required: true},
	sun_end : {type: String, required: true},
	sits : {type: Number, required: false},
	info : {type: String, required: false},
	opening : {type: String, required: true},
	sponsor : {type: String, required: false},
	timestamp : {type: Date, default: Date.now}
},
{
	collection : 'terraces',
	'toJSON': {virtuals: true},
	'toObject': {virtuals: true}
});

mongoose.model('Terrace', TerraceSchema);