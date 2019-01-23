console.log('This script populates posts into your database. Specified database as argument - e.g.: populatedbabilities mongodb://your_username:yourpassword@your_database_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}

var async = require('async');
var Ability = require('./models/abilities');
var mongoose = require('mongoose');
var mongoDB = userArgs[0];

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var abilities = [];

function abilityCreate(name, hero, cb) {
	
	abilitydetail = {name: name, hero: hero, slot: '', description: '', altdescription: {effect: '', info: ''}, notes: [], details: {stats: [{label: '', value: ''}], cooldown: '', manacost: ''}, image: ''}
	var ability = new Ability(abilitydetail);

	ability.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New Ability: ' + ability);
		abilities.push(ability)
		cb(null, ability)
	});
}

function createAbility(cb) {
	async.parallel([
		function(callback) {
			abilityCreate('Arcane Renewal', '5c1acd7994d5007c6234c726', callback);
		},
		function(callback) {
			abilityCreate('Gift of Fire', '5c1acd7994d5007c6234c726', callback);
		},
		function(callback) {
			abilityCreate('Agent of Wrath', '5c1acd7994d5007c6234c726', callback);
		},
		function(callback) {
			abilityCreate('Verse of Judgement', '5c1acd7994d5007c6234c726', callback);
		},
		function(callback) {
			abilityCreate('Infinite Reboot', '5c1acd7994d5007c6234c727', callback);
		},
		function(callback) {
			abilityCreate('Prime Directive', '5c1acd7994d5007c6234c727', callback);
		},
		function(callback) {
			abilityCreate('Core Charge', '5c1acd7994d5007c6234c727', callback);
		},
		function(callback) {
			abilityCreate('Termination Protocol', '5c1acd7994d5007c6234c727', callback);
		},
		function(callback) {
			abilityCreate('Gythian Promise', '5c1acd7994d5007c6234c728', callback);
		},
		function(callback) {
			abilityCreate('Shimmer Blade', '5c1acd7994d5007c6234c728', callback);
		},
		function(callback) {
			abilityCreate('Dance of BLades', '5c1acd7994d5007c6234c728', callback);
		},
		function(callback) {
			abilityCreate('Mirage', '5c1acd7994d5007c6234c728', callback);
		},
		function(callback) {
			abilityCreate("Julia's Gift", '5c1acd7a94d5007c6234c729', callback);
		},
		function(callback) {
			abilityCreate('Vanguard', '5c1acd7a94d5007c6234c729', callback);
		},
		function(callback) {
			abilityCreate('Blood for Blood', '5c1acd7a94d5007c6234c729', callback);
		},
		function(callback) {
			abilityCreate('Gauntlet', '5c1acd7a94d5007c6234c729', callback);
		},
		function(callback) {
			abilityCreate('Reap', '5c1acd7a94d5007c6234c72a', callback);
		},
		function(callback) {
			abilityCreate('Bad Mojo', '5c1acd7a94d5007c6234c72a', callback);
		},
		function(callback) {
			abilityCreate('Ordained', '5c1acd7a94d5007c6234c72a', callback);
		},
		function(callback) {
			abilityCreate('Fearsome Shade', '5c1acd7a94d5007c6234c72a', callback);
		},
		function(callback) {
			abilityCreate('Rocket Launcher', '5c1acd7a94d5007c6234c72b', callback);
		},
		function(callback) {
			abilityCreate('Porcupine Mortar', '5c1acd7a94d5007c6234c72b', callback);
		},
		function(callback) {
			abilityCreate('Jump Jets', '5c1acd7a94d5007c6234c72b', callback);
		},
		function(callback) {
			abilityCreate('Ion Cannon', '5c1acd7a94d5007c6234c72b', callback);
		},
		function(callback) {
			abilityCreate('Heartthrob', '5c1acd7a94d5007c6234c72c', callback);
		},
		function(callback) {
			abilityCreate('Feint of Heart', '5c1acd7a94d5007c6234c72c', callback);
		},
		function(callback) {
			abilityCreate('On Point', '5c1acd7a94d5007c6234c72c', callback);
		},
		function(callback) {
			abilityCreate('Rose Offensive', '5c1acd7a94d5007c6234c72c', callback);
		},
		function(callback) {
			abilityCreate('Captain of the Guard', '5c1acd7a94d5007c6234c72d', callback);
		},
		function(callback) {
			abilityCreate('Merciless Pursuit', '5c1acd7a94d5007c6234c72d', callback);
		},
		function(callback) {
			abilityCreate('Stormguard', '5c1acd7a94d5007c6234c72d', callback);
		},
		function(callback) {
			abilityCreate('Blast Tremor', '5c1acd7a94d5007c6234c72d', callback);
		},
		function(callback) {
			abilityCreate("Julia's Light", '5c1acd7a94d5007c6234c72e', callback);
		},
		function(callback) {
			abilityCreate('Heliogenesis', '5c1acd7a94d5007c6234c72e', callback);
		},
		function(callback) {
			abilityCreate('Core Collapse', '5c1acd7a94d5007c6234c72e', callback);
		},
		function(callback) {
			abilityCreate('Solar Storm', '5c1acd7a94d5007c6234c72e', callback);
		},
		function(callback) {
			abilityCreate('Futility of Life', '5c1acd7a94d5007c6234c72f', callback);
		},
		function(callback) {
			abilityCreate('Hook & Chain', '5c1acd7a94d5007c6234c72f', callback);
		},
		function(callback) {
			abilityCreate('Torment', '5c1acd7a94d5007c6234c72f', callback);
		},
		function(callback) {
			abilityCreate('Trespass', '5c1acd7a94d5007c6234c72f', callback);
		},
		function(callback) {
			abilityCreate('Willow Whisper', '5c1acd7a94d5007c6234c730', callback);
		},
		function(callback) {
			abilityCreate('Binding Light', '5c1acd7a94d5007c6234c730', callback);
		},
		function(callback) {
			abilityCreate('Fairy Dust', '5c1acd7a94d5007c6234c730', callback);
		},
		function(callback) {
			abilityCreate('Mooncloak', '5c1acd7a94d5007c6234c730', callback);
		},
		function(callback) {
			abilityCreate('Packmates', '5c1acd7a94d5007c6234c731', callback);
		},
		function(callback) {
			abilityCreate('Truth of the Tooth', '5c1acd7a94d5007c6234c731', callback);
		},
		function(callback) {
			abilityCreate('Law of the Claw', '5c1acd7a94d5007c6234c731', callback);
		},
		function(callback) {
			abilityCreate('Attack of the Pack', '5c1acd7a94d5007c6234c731', callback);
		},
		function(callback) {
			abilityCreate('Hunt the Weak', '5c1acd7a94d5007c6234c732', callback);
		},
		function(callback) {
			abilityCreate('Afterburn', '5c1acd7a94d5007c6234c732', callback);
		},
		function(callback) {
			abilityCreate('Twisted Stroke', '5c1acd7a94d5007c6234c732', callback);
		},
		function(callback) {
			abilityCreate('Bloodsong', '5c1acd7a94d5007c6234c732', callback);
		},
		function(callback) {
			abilityCreate('Retribution', '5c1acd7a94d5007c6234c733', callback);
		},
		function(callback) {
			abilityCreate('Benediction', '5c1acd7a94d5007c6234c733', callback);
		},
		function(callback) {
			abilityCreate('Holy Nova', '5c1acd7a94d5007c6234c733', callback);
		},
		function(callback) {
			abilityCreate('Divine Intervention', '5c1acd7a94d5007c6234c733', callback);
		},
		function(callback) {
			abilityCreate('Living Armor', '5c1acd7a94d5007c6234c734', callback);
		},
		function(callback) {
			abilityCreate('Grumpy', '5c1acd7a94d5007c6234c734', callback);
		},
		function(callback) {
			abilityCreate('Hangry', '5c1acd7a94d5007c6234c734', callback);
		},
		function(callback) {
			abilityCreate('Stuffed', '5c1acd7a94d5007c6234c734', callback);
		},
		function(callback) {
			abilityCreate('Boomstick', '5c1acd7a94d5007c6234c735', callback);
		},
		function(callback) {
			abilityCreate('Buckshot Bonanza', '5c1acd7a94d5007c6234c735', callback);
		},
		function(callback) {
			abilityCreate('Skedaddle', '5c1acd7a94d5007c6234c735', callback);
		},
		function(callback) {
			abilityCreate('Aces High', '5c1acd7a94d5007c6234c735', callback);
		},
		function(callback) {
			abilityCreate('Divergent Paths', '5c1acd7a94d5007c6234c736', callback);
		},
		function(callback) {
			abilityCreate('Shroudstep', '5c1acd7a94d5007c6234c736', callback);
		},
		function(callback) {
			abilityCreate('Chakram', '5c1acd7a94d5007c6234c736', callback);
		},
		function(callback) {
			abilityCreate('Shimmer Strike', '5c1acd7a94d5007c6234c736', callback);
		},
		function(callback) {
			abilityCreate('Sacred Grove', '5c1acd7a94d5007c6234c737', callback);
		},
		function(callback) {
			abilityCreate('Dance of Leaves', '5c1acd7a94d5007c6234c737', callback);
		},
		function(callback) {
			abilityCreate('Banishing Kick', '5c1acd7a94d5007c6234c737', callback);
		},
		function(callback) {
			abilityCreate("Nature's Wrath", '5c1acd7a94d5007c6234c737', callback);
		},
		function(callback) {
			abilityCreate('Heavy Plating', '5c1acd7a94d5007c6234c738', callback);
		},
		function(callback) {
			abilityCreate('Rocket Leap', '5c1acd7a94d5007c6234c738', callback);
		},
		function(callback) {
			abilityCreate('Thunder Strike', '5c1acd7a94d5007c6234c738', callback);
		},
		function(callback) {
			abilityCreate('Big Red Button', '5c1acd7a94d5007c6234c738', callback);
		},
		function(callback) {
			abilityCreate('Immovable Mind', '5c1acd7a94d5007c6234c739', callback);
		},
		function(callback) {
			abilityCreate('Lotus Strike', '5c1acd7a94d5007c6234c739', callback);
		},
		function(callback) {
			abilityCreate('Kensho', '5c1acd7a94d5007c6234c739', callback);
		},
		function(callback) {
			abilityCreate('Path of the Ronin', '5c1acd7a94d5007c6234c739', callback);
		},
		function(callback) {
			abilityCreate('Adrenaline', '5c1acd7a94d5007c6234c73a', callback);
		},
		function(callback) {
			abilityCreate('Glimmershot', '5c1acd7a94d5007c6234c73a', callback);
		},
		function(callback) {
			abilityCreate('Active Camo', '5c1acd7a94d5007c6234c73a', callback);
		},
		function(callback) {
			abilityCreate('One Shot One Kill', '5c1acd7a94d5007c6234c73a', callback);
		},
		function(callback) {
			abilityCreate('Tracer Shots', '5c1acd7a94d5007c6234c73b', callback);
		},
		function(callback) {
			abilityCreate('Plasma Driver', '5c1acd7a94d5007c6234c73b', callback);
		},
		function(callback) {
			abilityCreate('Inertial Dash', '5c1acd7a94d5007c6234c73b', callback);
		},
		function(callback) {
			abilityCreate('Charged Pulse', '5c1acd7a94d5007c6234c73b', callback);
		},
		function(callback) {
			abilityCreate('Bloodrush', '5c1acd7a94d5007c6234c73c', callback);
		},
		function(callback) {
			abilityCreate('Pouncy Fun', '5c1acd7a94d5007c6234c73c', callback);
		},
		function(callback) {
			abilityCreate('Twirly Death', '5c1acd7a94d5007c6234c73c', callback);
		},
		function(callback) {
			abilityCreate('Yummy Catnip Frenzy', '5c1acd7a94d5007c6234c73c', callback);
		},
		function(callback) {
			abilityCreate('Shadows Empower Me', '5c1acd7a94d5007c6234c73d', callback);
		},
		function(callback) {
			abilityCreate("Dead Man's Rush", '5c1acd7a94d5007c6234c73d', callback);
		},
		function(callback) {
			abilityCreate('Spectral Smite', '5c1acd7a94d5007c6234c73d', callback);
		},
		function(callback) {
			abilityCreate("From Hell's Heart", '5c1acd7a94d5007c6234c73d', callback);
		},
		function(callback) {
			abilityCreate("Partisan's Technique", '5c1acd7a94d5007c6234c73e', callback);
		},
		function(callback) {
			abilityCreate('Impale', '5c1acd7a94d5007c6234c73e', callback);
		},
		function(callback) {
			abilityCreate('Gythian Wall', '5c1acd7a94d5007c6234c73e', callback);
		},
		function(callback) {
			abilityCreate('Combat Roll', '5c1acd7a94d5007c6234c73e', callback);
		},
		function(callback) {
			abilityCreate("That's Swell", '5c1acd7a94d5007c6234c73f', callback);
		},
		function(callback) {
			abilityCreate('Fish Food', '5c1acd7a94d5007c6234c73f', callback);
		},
		function(callback) {
			abilityCreate('Splashdown', '5c1acd7a94d5007c6234c73f', callback);
		},
		function(callback) {
			abilityCreate('Waterwall', '5c1acd7a94d5007c6234c73f', callback);
		},
		function(callback) {
			abilityCreate('Principle Arcanum', '5c1acd7a94d5007c6234c740', callback);
		},
		function(callback) {
			abilityCreate('Imperial Sigil', '5c1acd7a94d5007c6234c740', callback);
		},
		function(callback) {
			abilityCreate('Bright Bulwark', '5c1acd7a94d5007c6234c740', callback);
		},
		function(callback) {
			abilityCreate('Arcane Passage', '5c1acd7a94d5007c6234c740', callback);
		},
		function(callback) {
			abilityCreate('Arcane Rite', '5c1acd7a94d5007c6234c741', callback);
		},
		function(callback) {
			abilityCreate('Mystic Missle', '5c1acd7a94d5007c6234c741', callback);
		},
		function(callback) {
			abilityCreate('Chrono Driver', '5c1acd7a94d5007c6234c741', callback);
		},
		function(callback) {
			abilityCreate('Seraphim Flare', '5c1acd7a94d5007c6234c741', callback);
		},
		function(callback) {
			abilityCreate('Masked Ball', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Light Ribbons', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Shadow Tendrils', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Royal Amnesty', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Wicked Escapade', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Enchanted Transformation', '5c1acd7a94d5007c6234c742', callback);
		},
		function(callback) {
			abilityCreate('Carnie Luck', '5c1acd7a94d5007c6234c743', callback);
		},
		function(callback) {
			abilityCreate('Three-Ring Circus', '5c1acd7a94d5007c6234c743', callback);
		},
		function(callback) {
			abilityCreate('Acrobounce', '5c1acd7a94d5007c6234c743', callback);
		},
		function(callback) {
			abilityCreate('Bangarang', '5c1acd7a94d5007c6234c743', callback);
		},
		function(callback) {
			abilityCreate('Munions', '5c1acd7a94d5007c6234c744', callback);
		},
		function(callback) {
			abilityCreate('Brambleboom Seeds', '5c1acd7a94d5007c6234c744', callback);
		},
		function(callback) {
			abilityCreate('Trampoline!', '5c1acd7a94d5007c6234c744', callback);
		},
		function(callback) {
			abilityCreate('Spontaneous Combustion', '5c1acd7a94d5007c6234c744', callback);
		},
		function(callback) {
			abilityCreate('Unstoppable', '5c1acd7a94d5007c6234c745', callback);
		},
		function(callback) {
			abilityCreate('Quibble', '5c1acd7a94d5007c6234c745', callback);
		},
		function(callback) {
			abilityCreate('Polite Company', '5c1acd7a94d5007c6234c745', callback);
		},
		function(callback) {
			abilityCreate('Forced Accord', '5c1acd7a94d5007c6234c745', callback);
		},
		function(callback) {
			abilityCreate('Frostguard', '5c1acd7a94d5007c6234c746', callback);
		},
		function(callback) {
			abilityCreate('Winter Spire', '5c1acd7a94d5007c6234c746', callback);
		},
		function(callback) {
			abilityCreate('Chill Winds', '5c1acd7a94d5007c6234c746', callback);
		},
		function(callback) {
			abilityCreate('Valkyrie', '5c1acd7a94d5007c6234c746', callback);
		},
		function(callback) {
			abilityCreate('Firestarter', '5c1acd7a94d5007c6234c747', callback);
		},
		function(callback) {
			abilityCreate('Scorcher', '5c1acd7a94d5007c6234c747', callback);
		},
		function(callback) {
			abilityCreate('Troublemaker', '5c1acd7a94d5007c6234c747', callback);
		},
		function(callback) {
			abilityCreate('Netherform Detonator', '5c1acd7a94d5007c6234c747', callback);
		},
		function(callback) {
			abilityCreate('Double Down', '5c1acd7a94d5007c6234c748', callback);
		},
		function(callback) {
			abilityCreate('Achilles Shot', '5c1acd7a94d5007c6234c748', callback);
		},
		function(callback) {
			abilityCreate('Twirling Silver', '5c1acd7a94d5007c6234c748', callback);
		},
		function(callback) {
			abilityCreate('Hellfire Brew', '5c1acd7a94d5007c6234c748', callback);
		},
		function(callback) {
			abilityCreate("Berserkers' Fury", '5c1acd7a94d5007c6234c749', callback);
		},
		function(callback) {
			abilityCreate('Into the Fray', '5c1acd7a94d5007c6234c749', callback);
		},
		function(callback) {
			abilityCreate('Foesplitter', '5c1acd7a94d5007c6234c749', callback);
		},
		function(callback) {
			abilityCreate('Red Mist', '5c1acd7a94d5007c6234c749', callback);
		},
		function(callback) {
			abilityCreate('Corrupted Genius', '5c1acd7a94d5007c6234c74a', callback);
		},
		function(callback) {
			abilityCreate('Malice & Verdict', '5c1acd7a94d5007c6234c74a', callback);
		},
		function(callback) {
			abilityCreate('Drifting Dark', '5c1acd7a94d5007c6234c74a', callback);
		},
		function(callback) {
			abilityCreate('Oblivion', '5c1acd7a94d5007c6234c74a', callback);
		},
		function(callback) {
			abilityCreate('Spin Up', '5c1acd7a94d5007c6234c74b', callback);
		},
		function(callback) {
			abilityCreate('Roadie Run', '5c1acd7a94d5007c6234c74b', callback);
		},
		function(callback) {
			abilityCreate('Suppressing Fire', '5c1acd7a94d5007c6234c74b', callback);
		},
		function(callback) {
			abilityCreate('Mad Cannon', '5c1acd7a94d5007c6234c74b', callback);
		},
		function(callback) {
			abilityCreate('Double Shot', '5c1acd7a94d5007c6234c74c', callback);
		},
		function(callback) {
			abilityCreate('Stake', '5c1acd7a94d5007c6234c74c', callback);
		},
		function(callback) {
			abilityCreate('Caustic Blessing', '5c1acd7a94d5007c6234c74c', callback);
		},
		function(callback) {
			abilityCreate('Rebuke', '5c1acd7a94d5007c6234c74c', callback);
		},
		function(callback) {
			abilityCreate('Fan the FLames', '5c1acd7a94d5007c6234c74d', callback);
		},
		function(callback) {
			abilityCreate('Spitfire', '5c1acd7a94d5007c6234c74d', callback);
		},
		function(callback) {
			abilityCreate('Goop', '5c1acd7a94d5007c6234c74d', callback);
		},
		function(callback) {
			abilityCreate("Dragon's Break", '5c1acd7a94d5007c6234c74d', callback);
		},
		function(callback) {
			abilityCreate('Target Lock', '5c1acd7a94d5007c6234c74e', callback);
		},
		function(callback) {
			abilityCreate('Forward Barrage', '5c1acd7a94d5007c6234c74e', callback);
		},
		function(callback) {
			abilityCreate('Suri Strike', '5c1acd7a94d5007c6234c74e', callback);
		},
		function(callback) {
			abilityCreate('Death From Above', '5c1acd7a94d5007c6234c74e', callback);
		},
		function(callback) {
			abilityCreate('House Kamuha', '5c1acd7a94d5007c6234c74f', callback);
		},
		function(callback) {
			abilityCreate('Kaiten', '5c1acd7a94d5007c6234c74f', callback);
		},
		function(callback) {
			abilityCreate('Kaku', '5c1acd7a94d5007c6234c74f', callback);
		},
		function(callback) {
			abilityCreate('X-Retsu', '5c1acd7a94d5007c6234c74f', callback);
		},
		function(callback) {
			abilityCreate('Come At Me', '5c1acd7a94d5007c6234c750', callback);
		},
		function(callback) {
			abilityCreate('Jawbreaker', '5c1acd7a94d5007c6234c750', callback);
		},
		function(callback) {
			abilityCreate('Trash Talk', '5c1acd7a94d5007c6234c750', callback);
		},
		function(callback) {
			abilityCreate('Bada Boom', '5c1acd7a94d5007c6234c750', callback);
		},
		function(callback) {
			abilityCreate('Chain Lightening', '5c1acd7a94d5007c6234c751', callback);
		},
		function(callback) {
			abilityCreate('Stormforged Spear', '5c1acd7a94d5007c6234c751', callback);
		},
		function(callback) {
			abilityCreate('Arc Recursion', '5c1acd7a94d5007c6234c751', callback);
		},
		function(callback) {
			abilityCreate("Anvil's Hammer", '5c1acd7a94d5007c6234c751', callback);
		},
		function(callback) {
			abilityCreate("Julia's Song", '5c1acd7a94d5007c6234c752', callback);
		},
		function(callback) {
			abilityCreate('Sonic Zoom', '5c1acd7a94d5007c6234c752', callback);
		},
		function(callback) {
			abilityCreate('Pulse', '5c1acd7a94d5007c6234c752', callback);
		},
		function(callback) {
			abilityCreate('Wait for It', '5c1acd7a94d5007c6234c752', callback);
		},
		function(callback) {
			abilityCreate('Devastation Flail', '5c1acd7a94d5007c6234c753', callback);
		},
		function(callback) {
			abilityCreate("Wolf's Maw", '5c1acd7a94d5007c6234c753', callback);
		},
		function(callback) {
			abilityCreate('Overwhelm', '5c1acd7a94d5007c6234c753', callback);
		},
		function(callback) {
			abilityCreate('Iron Mandate', '5c1acd7a94d5007c6234c753', callback);
		}
	],
		//optional callback
		cb);
}

async.series([
	createAbility
],
	// Optional callback
function(err, results) {
	if (err) {
		console.log('FINAL ERR: '+err);
	}
	else {
		console.log('ABILITYInstances: '+abilities);
	}
	// All done, disconnect from database
	mongoose.connection.close();
});

