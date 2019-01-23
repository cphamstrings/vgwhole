console.log('This script populates heroes into your database. Specified database as argument - e.g.: populatedbheroes mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}

var async = require('async')
var Hero = require('./models/heroes')
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var heroes = []

function heroCreate(name, role, health, healthRegen, energy, energyRegen, weaponDamage, attackSpeed, armor, shield, attackRange, moveSpeed, cb) {
	herodetail = {name: name, role: role, attributes: { health: health, healthRegen: healthRegen, energy: energy, energyRegen: energyRegen, weaponDamage: weaponDamage, attackSpeed: attackSpeed, armor: armor, shield: shield, attackRange: attackRange, moveSpeed: moveSpeed }, stats: {}, img:'' } 

	var hero = new Hero(herodetail);
	
	hero.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New Hero: ' + hero);
		heroes.push(hero)
		cb(null, hero)
	});
}

function createHero(cb) {
	async.parallel([
		function(callback) {
			heroCreate('Adagio', 'Protector', '685 (+147.55)', '2.18 (+0.26)', '400 (+35)', '2.67( +0.23)', '75( +3.82)', '100% (+2%)', '20 (+2.73)', '20( +2.73)', '6.7', '3.4', callback);
		},
		function(callback) {
			heroCreate('Alpha', 'Warrior', '761 (+161.45)', '3.14 (+0.35)', '(+)', '(+)', '83 (+3.73)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '2.1', '3.6', callback);
		},
		function(callback) {
			heroCreate('Anka', 'Assasin', '750 (+141)', '4.67 (+0.41)', '200 (+45)', '2.6 (+0.2)', '82 (+6.36)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.6', '3.6', callback);
		},
		function(callback) {
			heroCreate('Ardan', 'Protector', '838 (+163.64)', '3.39 (+0.35)', '(+)', '(+)', '80 (+5.45)', '100% (+3.3%)', '20 (+4.55)', '20 (+4.55)', '1.8', '3.4', callback);
		},
		function(callback) {
			heroCreate('Baptiste', 'Mage', '739 (+144)', '2.38 (+0.27)', '273 (+33)', '2.17 (+0.19)', '78 (+8.09)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '2.8', '3.5', callback);
		},
		function(callback) {
			heroCreate('Baron', 'Sniper', '679 (+125)', '3.29 (+0.42)', '270 (+45)', '6.67 (+1.03)', '71 (+5.36)', '100% (+1%)', '20 (+2.73)', '20 (+2.73)', '5.4', '3', callback);
		},
		function(callback) {
			heroCreate('Blackfeather', 'Assassin', '657 (+157.27)', '(+)', '(+)', '(+)', '81 (+7.18)', '100% (+2%)', '20 (+2.73)', '20 (+2.73)', '1.8', '3.5', callback);
		},
		function(callback) {
			heroCreate('Catherine', 'Protector', '808 (+169.55)', '4.06 (+0.35)', '200 (+24)', '1.33 (+0.16)', '74 (+6.09)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.5', '3.6', callback);
		},
		function(callback) {
			heroCreate('Celeste', 'Mage', '649 (+125.36)', '2.23 (+0.23)', '380 (+32)', '2.53 (+0.21)', '10 (+)', '100% (+2.27%)', '20 (+2.73)', '20 (+2.73)', '5.3', '3.4', callback);
		},
		function(callback) {
			heroCreate('Churnwalker', 'Warrior', '863 (+171.46)', '4.05 (+0.25)', '380 (+32)', '2.38 (+0.21)', '80 (+7.73)', '100% (+2%)', '20 (+4.55)', '20 (+4.55)', '1.7', '3.2', callback);
		},
		function(callback) {
			heroCreate('Flicker', 'Protector', '797 (+168.27)', '3.85 (+)', '295 (+42)', '1.94 (+0.25)', '77 (+7.09)', '100% (+3.3%)', '20 (+4.55)', '20 (+4.55)', '1.5', '3.7', callback);
		},
		function(callback) {
			heroCreate('Fortress', 'Protector/Initiator', '761 (+165.45)', '4.30 (+0.51)', '300 (+15)', '1.56 (+0.15)', '73 (+7.55)', '100% (+4%)', '20 (+3.64)', '20 (+3.64)', '1.8', '3.6', callback);
		},
		function(callback) {
			heroCreate('Glaive', 'Warrior', '834 (+151.73)', '2.47 (+0.34)', '275 (+15)', '1.47 (+0.13)', '70 (+7.82)', '100% (+2%)', '20 (+3.64)', '20 (+3.64)', '2.8', '3.5', callback);
		},
		function(callback) {
			heroCreate('Grace', 'Protector', '740 (+158.45)', '3.72 (+0.42)', '268 (+35)', '1.92 (+0.21)', '73 (+7.18)', '100% (+3.3%)', '20 (+4.55)', '20 (+4.55)', '2.7', '3.6', callback);
		},
		function(callback) {
			heroCreate('Grumpjaw', 'Warrior', '783 (+164.45)', '4.01 (+0.31)', '234 (+21)', '1.51 (+0.14)', '74 (+7.64)', '100% (+1.2%)', '20 (+3.64)', '20 (+3.64)', '2.6', '3.5', callback);
		},
		function(callback) {
			heroCreate('Gwen', 'Sniper', '661 (+128.27)', '2.63 (+0.23)', '175 (+20)', '1.20 (+0.15)', '68 (+5.82)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3', callback);
		},
		function(callback) {
			heroCreate('Idris', 'Assassin', '697 (+141.82)', '4.5 (+)', '(+)', '(+)', '77 (+7.64)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '2.4', '3.4', callback);
		},
		function(callback) {
			heroCreate('Inara', '', '(+)', '(+)', '(+)', '(+)', '(+)', '(+)', '(+)', '(+)', '', '', callback);
		},
		function(callback) {
			heroCreate('Joule', 'Warrior', '742 (+158.64)', '4.27 (+0.47)', '390 (+15)', '3.5 (+0.32)', '66 (+7.45)', '100% (+1.2%)', '20 (+2.73)', '20 (+2.73)', '2.4', '3.4', callback);
		},
		function(callback) {
			heroCreate('Kensei', 'Carry', '761 (+157.45)', '4.01 (+0.31)', '280 (+33)', '1.87 (+0.22)', '90 (+4)', '100% (+3.3%)', '20 (+3.64)', '20 +(3.64)', '3.5', '3.6', callback);
		},
		function(callback) {
			heroCreate('Kestrel', 'Sniper', '700 (+124.82)', '(+)', '404 (+8)', '(+)', '70 (+6)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3.1', callback);
		},
		function(callback) {
			heroCreate('Kintetic', 'Sniper', '721 (+118)', '3.81 (+0.27)', '169 (+20)', '3.51 (+0.23)', '64 (+3)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.1', '3.4', callback);
		},
		function(callback) {
			heroCreate('Koshka', 'Assassin', '711 (+150.55)', '3.54 (+0.31)', '280 (+33)', '187 (+0.22)', '79 (+7.73)', '100% (+0.8%)', '20 (+3.64)', '20 (+3.64)', '1.7', '3.3', callback);
		},
		function(callback) {
			heroCreate('Krul', 'Warrior', '748 (+158.73)', '3.51 (+0.39)', '220 (+26)', '1.33 (+0.17)', '70 (+7)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.5', '3.4', callback);
		},
		function(callback) {
			heroCreate('Lance', 'Protector', '842 (+160.64)', '3.79 (+0.65)', '(+)', '(+)', '85 (+8.45)', '100% (+2%)', '20 (+4.54)', '20 (+4.54)', '4.5', '3.3', callback);
		},
		function(callback) {
			heroCreate('Lorelai', 'Protector', '691 (+141.92)', '3.14 (+0.22)', '360 (+30)', '3.47 (+0.23)', '10 (+)', '92.5% (+2.5%)', '20 (+2.73)', '20 (+2.73)', '6', '3.3', callback);
		},
		function(callback) {
			heroCreate('Lyra', 'Protector', '774 (+134.45)', '401 (+0.31)', '248 (+60)', '2.15 (+0.45)', '10 (+)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '5.6', '3.3', callback);
		},
		function(callback) {
			heroCreate('Magnus', 'Mage', '648 (+128.82)', '(+)', '380 (+32)', '(+)', '80 (+7.09)', '100% (+2.27%)', '25 (+4.55)', '20 (+3.18)', '6', '3.4', callback);
		},
		function(callback) {
			heroCreate('Malene', 'Carry', '696 (+132)', '4.75 (+0.3)', '300 (+34.91)', '3.20 (+0.2)', '10 (+)', '100% (+2%)', '20 (+2.73)', '20 (+2.73)', '5.8', '3.4', callback);
		},
		function(callback) {
			heroCreate('Ozo', 'Warrior', '769 (+160.64)', '(+)', '350 (+27.27)', '(+)', '80 (+7)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.7', '3.4', callback);
		},
		function(callback) {
			heroCreate('Petal', 'Sniper', '636 (+122.45)', '2.40 (+0.25)', '410 (+28)', '1.00 (+0.11)', '64 (+6.36)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3.2', callback);
		},
		function(callback) {
			heroCreate('Phinn', 'Protector', '892 (+171.73)', '(+)', '220 (+20)', '(+)', '95 (+5.36)', '100% (+1.2%)', '20 (+4.55)', '20 (+4.55)', '1.9', '3.0', callback);
		},
		function(callback) {
			heroCreate('Reim', 'Mage', '746 (+159.36)', '(+)', '220 (+22)', '(+)', '80 (+6.64)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.9', '3.4', callback);
		},
		function(callback) {
			heroCreate('Reza', 'Assassin', '718 (+144.36)', '3.82 (+0.31)', '380 (+32)', '2.53 (+0.21)', '84 (+6.36)', '100% (+2.27%)', '20 (+3.64)', '20 (+3.64)', '3', '3.5', callback);
		},
		function(callback) {
			heroCreate('Ringo', 'Sniper', '703 (+127.64)', '2.15 (+0.23)', '163 (+23)', '1.20 (+0.15)', '71 (+5.36)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3.1', callback);
		},
		function(callback) {
			heroCreate('Rona', 'Warrior', '778 (+162.27)', '(+)', '(+)', '(+)', '77 (+7.18)', '100% (+2%)', '20 (+3.64)', '20 (+3.64)', '1.8', '3.4', callback);
		},
		function(callback) {
			heroCreate('Samuel', 'Mage', '652 (+126.18)', '401 (+0.31)', '290 (+30)', '2.15 (+0.45)', '78 (+6.36)', '100% (+2.7%)', '20 (+2.73)', '20 (+2.73)', '6.3', '3.2', callback);
		},
		function(callback) {
			heroCreate('SAW', 'Sniper', '683 (+121.82)', '2.40 (+0.25)', '150 (+15)', '1.00 (+0.11)', '50 (+7)', '1 (+0.01)', '20 (+3.64)', '20 (+3.64)', '6.6', '3.1', callback);
		},
		function(callback) {
			heroCreate('Silvernail', '', '745 (+130)', '2.32 (+0.47)', '203 (+37)', '2.36 (+0.26)', '74 (+5.18)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3.5', callback);
		},
		function(callback) {
			heroCreate('Skaarf', 'Mage', '638 (+134)', '3.55 (+0.35)', '200 (+24)', '1.33 (+0.16)', '80 (+6.73)', '100% (+2%)', '20 (+2.73)', '20 (+2.73)', '5.5', '3.4', callback);
		},
		function(callback) {
			heroCreate('Skye', 'Sniper', '708 (+126.55)', '(+)', '380 (+32)', '(+)', '72 (+3.55)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '6.1', '3.2', callback);
		},
		function(callback) {
			heroCreate('Taka', 'Assassin', '702 (+144.09)', '3.51 (+0.35)', '180 (+22)', '1.33 (+0.16)', '68 (+5.18)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '2', '3.5', callback);
		},
		function(callback) {
			heroCreate('Tony', 'Warrior', '762 (+162)', '4.01 (+0.31)', '280 (+33)', '1.87 (+0.22)', '79 (+7.8)', '100% (+3.3%)', '20 (+3.64)', '20 (+3.64)', '1.7', '3.4', callback);
		},
		function(callback) {
			heroCreate('Varya', 'Mage', '642 (+135)', '2.81 (+0.31)', '950 (+50)', '36 (+2.6)', '10 (+)', '100% (+1.36%)', '20 (+2.73)', '20 (+2.73)', '6.2', '3.2', callback);
		},
		function(callback) {
			heroCreate('Vox', 'Sniper', '667 (+126.09)', '3.55 (+0.35)', '200 (+24)', '1.33 (+0.16)', '54 (+5)', '100% (+3.3%)', '20 (+2.73)', '20 (+2.73)', '5.6', '3.4', callback);
		},
		function(callback) {
			heroCreate('Yates', 'Protector', '857 (+165)', '(+)', '174 (+27)', '(+)', '82 (+8.18)', '100% (+3.3%)', '20 (+4.55)', '20 (+4.55)', '3.4', '3.4', callback);
		},
	],
	// optional callback
	cb);
}

async.series([
	createHero
],
// Optional callback
function(err, results) {
	if (err) {
		console.log('FINAL ERR: '+err);
	}
	else {
		console.log('HEROInstances: '+heroes);
	}
	// All done, disconnect from database
	mongoose.connection.close();
});
