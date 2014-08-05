'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// TERRACE MODEL

var TerraceSchema = new Schema({
	name : {type: String, required: true},
	type : {type: String, required: false},
	block : {type: String, required: false},
	loc : { type: {}, index: '2dsphere', sparse: true },
	// loc: {
 	//      type: { type: String }, 
 	//      coordinates: []
 	//    },
	address:{
		street : {type: String, required: true},
		number : {type: String, required: true},
		zip : {type: String, required: true}
	},
	phone : {type: String, required: false},
	mail : {type: String, required: false},
	web : {type: String, required: false},
	sun_start : {type: String, required: false},
	sun_end : {type: String, required: false},
	sits : {type: Number, required: false},
	info : {type: String, required: false},
	opening : {type: String, required: false},
	sponsor : {type: String, required: false},
	timestamp : {type: Date, default: Date.now}
},
{
	collection : 'terraces',
	'toJSON': {virtuals: true},
	'toObject': {virtuals: true}
});

TerraceSchema.pre('save', function (next) {
	if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
		this.location = undefined;
	}
	next();
});

TerraceSchema.index({ loc : '2dsphere' });

mongoose.model('Terrace', TerraceSchema);