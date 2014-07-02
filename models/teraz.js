'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*Dare schema*/
var TerazSchema = new Schema({
	name : {type: String, required: true},
	type : {type: String, required: true, default: 'terrasse'},
	block : {type: String, required: true},
	address:{
		loc : {
			type: { type: String },
			coordinates: []
		},
		street : {type: String, required: true},
		number : {type: String, required: true},
		zip : {type: String, required: true},
		city : {type: String, required: true},
	},
	phone : {type: String, required: false},
	mail : {type: String, required: false},
	web : {type: String, required: false},
	sun_start : {type: String, required: true},
	sun_end : {type: String, required: true},
	sits : {type: Number, required: false},
	info : {type: String, required: false},
	opening : {type: String, required: true},
	timestamp : {type: Date, default: Date.now}
},
{
	collection : 'teraz',
	'toJSON': {virtuals: true},
	'toObject': {virtuals: true}
});
//TerazSchema.index({address: { loc: '2dsphere' }});

mongoose.model('Teraz', TerazSchema);