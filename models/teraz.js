'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*Dare schema*/
var TerazSchema = new Schema({
	name : {type: String, required: true},
	type : {type: String, required: true, default: 'terrasse'},
	block : {type: String, required: true},
	loc: { type: {}, index: '2dsphere', sparse: true },
	address:{
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

TerazSchema.pre('save', function (next) {
  var value = that.get('loc');

  if (value === null) return next();
  if (value === undefined) return next();
  if (!Array.isArray(value)) return next(new Error('Coordinates must be an array'));
  if (value.length === 0) return that.set(path, undefined);
  if (value.length !== 2) return next(new Error('Coordinates should be of length 2'))

  next();
});

mongoose.model('Teraz', TerazSchema);