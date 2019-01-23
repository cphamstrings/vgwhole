console.log('This script updates hereos documents into your database. Specified database as argument -e.g.: updateheroesdocs mongodb://your_username:yourpassword@your_database_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if(!userArgs[0].startsWith('mongodb://')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}

var async = require('async');
var Hero = require('./models/heroes');
var mongoose = require('mongoose');
var mongoDB = userArgs[0];

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


Hero.update(
	{abilities: "[{ type: Schema.Types.ObjectId, ref: 'abilities' }]"},
	{multi: true},
		function(err, numberAffected){
		});


mongoose.connection.close()
