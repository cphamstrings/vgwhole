console.log('This script populates items into your database. Specified database as argument - e.g.: populatedbitems mongodb://your_username:yourpassword@your_database_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}

var async = require('async');
var Item = require('./models/items');
var mongoose = require('mongoose');
var mongoDB = userArgs[0];

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];

function itemCreate(name, cb) {
	
	itemdetail = {name: name, category: '', tier: 0, price: 0, attributes: [], details: [{label: '', value: ''}], buildsInto: [{}], buildsFrom: [{}], notes: '', image: '/images/items/'}

	var item = new Item(itemdetail);

	item.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New Item: ' + item);
		items.push(item);
		cb(null, item)
	});
}

function createItem(cb) {
	async.parallel([
		function(callback) {
			itemCreate('Aegis', callback);
		},
		function(callback) {
			itemCreate('Aftershock', callback);
		},
		function(callback) {
			itemCreate('Alternating Current', callback);
		},
		function(callback) {
			itemCreate('Atlas Pauldron', callback);
		},
		function(callback) {
			itemCreate('Barbed Needle', callback);
		},
		function(callback) {
			itemCreate('Blazing Salvo', callback);
		},
		function(callback) {
			itemCreate('Bonesaw', callback);
		},
		function(callback) {
			itemCreate('Book of Eulogies', callback);
		},
		function(callback) {
			itemCreate('Breaking Point', callback);
		},
		function(callback) {
			itemCreate('Broken Myth', callback);
		},
		function(callback) {
			itemCreate('Capacitor Plate', callback);
		},
		function(callback) {
			itemCreate('Celestial Shroud', callback);
		},
		function(callback) {
			itemCreate('Chronograph', callback);
		},
		function(callback) {
			itemCreate('Clockwork', callback);
		},
		function(callback) {
			itemCreate('Coat of Plates', callback);
		},
		function(callback) {
			itemCreate('Contraption', callback);
		},
		function(callback) {
			itemCreate('Crucible', callback);
		},
		function(callback) {
			itemCreate('Crystal Bit', callback);
		},
		function(callback) {
			itemCreate('Crystal Infusion', callback);
		},
		function(callback) {
			itemCreate("Dragon's Eye", callback);
		},
		function(callback) {
			itemCreate('Dragonblood Contract', callback);
		},
		function(callback) {
			itemCreate('Dragonheart', callback);
		},
		function(callback) {
			itemCreate('Eclipse Prism', callback);
		},
		function(callback) {
			itemCreate('Energy Battery', callback);
		},
		function(callback) {
			itemCreate('Eve of Harvest', callback);
		},
		function(callback) {
			itemCreate('Flare', callback);
		},
		function(callback) {
			itemCreate('Flare Gun', callback);
		},
		function(callback) {
			itemCreate('Flare Loader', callback);
		},
		function(callback) {
			itemCreate('Fountain of Renewal', callback);
		},
		function(callback) {
			itemCreate('Frostburn', callback);
		},
		function(callback) {
			itemCreate('Halycon Chargers', callback);
		},
		function(callback) {
			itemCreate('Healing Flask', callback);
		},
		function(callback) {
			itemCreate('Heavy Prism', callback);
		},
		function(callback) {
			itemCreate('Heavy Steel', callback);
		},
		function(callback) {
			itemCreate('Hourglass', callback);
		},
		function(callback) {
			itemCreate('Ironguard Contract', callback);
		},
		function(callback) {
			itemCreate('Journey Boots', callback);
		},
		function(callback) {
			itemCreate('Kinetic Shield', callback);
		},
		function(callback) {
			itemCreate('Level Juice', callback);
		},
		function(callback) {
			itemCreate('Lifespring', callback);
		},
		function(callback) {
			itemCreate('Light Armor', callback);
		},
		function(callback) {
			itemCreate('Light Shield', callback);
		},
		function(callback) {
			itemCreate('Lucky Strike', callback);
		},
		function(callback) {
			itemCreate('Metal Jacket', callback);
		},
		function(callback) {
			itemCreate('Minion Candy', callback);
		},
		function(callback) {
			itemCreate("Minion's Foot", callback);
		},
		function(callback) {
			itemCreate('Nullwave Gauntlet', callback);
		},
		function(callback) {
			itemCreate('Oakheart', callback);
		},
		function(callback) {
			itemCreate('Piercing Shard', callback);
		},
		function(callback) {
			itemCreate('Piercing Spear', callback);
		},
		function(callback) {
			itemCreate('Poisoned Shiv', callback);
		},
		function(callback) {
			itemCreate('Protector Contract', callback);
		},
		function(callback) {
			itemCreate('Pulseweave', callback);
		},
		function(callback) {
			itemCreate('Reflex Block', callback);
		},
		function(callback) {
			itemCreate("Rook's Decree", callback);
		},
		function(callback) {
			itemCreate('Scout Trap', callback);
		},
		function(callback) {
			itemCreate('ScoutPak', callback);
		},
		function(callback) {
			itemCreate('ScoutTuff', callback);
		},
		function(callback) {
			itemCreate('Serpent Mask', callback);
		},
		function(callback) {
			itemCreate('Shatterglass', callback);
		},
		function(callback) {
			itemCreate('Shiversteel', callback);
		},
		function(callback) {
			itemCreate('Six Sins', callback);
		},
		function(callback) {
			itemCreate('Slumbering Husk', callback);
		},
		function(callback) {
			itemCreate('Sorrowblade', callback);
		},
		function(callback) {
			itemCreate('Spellfire', callback);
		},
		function(callback) {
			itemCreate('Spellsword', callback);
		},
		function(callback) {
			itemCreate('Sprint Boots', callback);
		},
		function(callback) {
			itemCreate('Stormcrown', callback);
		},
		function(callback) {
			itemCreate('Stormguard Banner', callback);
		},
		function(callback) {
			itemCreate('SuperScout 2000', callback);
		},
		function(callback) {
			itemCreate('Swift Shooter', callback);
		},
		function(callback) {
			itemCreate('Teleport Boots', callback);
		},
		function(callback) {
			itemCreate('Tension Bow', callback);
		},
		function(callback) {
			itemCreate('Tornado Trigger', callback);
		},
		function(callback) {
			itemCreate('Travel Boots', callback);
		},
		function(callback) {
			itemCreate("Tyrant's Monocle", callback);
		},
		function(callback) {
			itemCreate('Void Battery', callback);
		},
		function(callback) {
			itemCreate('War Treads', callback);
		},
		function(callback) {
			itemCreate('Warmail', callback);
		},
		function(callback) {
			itemCreate('Weapon Blade', callback);
		},
		function(callback) {
			itemCreate('Weapon Infusion', callback);
		},

		
	],
		// optional callback
		cb);
}

async.series([
	createItem
],
	// Optional callback
function(err, results) {
	if (err) {
		console.log('Final ERR: '+err);
	}
	else {
		console.log('ITEMInstances: '+items);
	}
	// All done, disconnect from database
	mongoose.connection.close();
});

