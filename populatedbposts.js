console.log('This script populates posts into your database. Specified database as argument - e.g.: populatedbposts mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
	console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
	return
}

var async = require('async')
var Blog = require('./models/blogposts')
var mongoose = require('mongoose');
var mongoDB = userArgs[0];

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var posts = [];

function postCreate(title, author, date, summary, cb) {
	
	postdetail = {title: title, author: author, date: date, summary: summary, content: '', image: ''}
	var post = new Blog(postdetail);

	post.save(function (err) {
	
		console.log('New Post: ' + post);
		posts.push(post)
		cb(null, post)
	});
}

function createPost(cb) {
	async.parallel([
		function(callback) {
			postCreate('The New Clinkz', 'KawaiiSocks', 'December 24, 2018', 'Clinkz was reworked slightly over a month ago. The initial impression of the community on the hero was rather poor and this reaction was more than justified—much like Drow Ranger, Clinkz started his 7.20 career as an incredibly weak hero.', callback);
		},
		function(callback) {
			postCreate("How Good Are 7.20's New Holy Locket and Kaya Items?", 'Eggs', "Patch 7.20 introduced Holy Locket and gave heroes more reason to build Kaya, with its next tier items in Kaya & Sange and Yasha & Kaya. How have they performed in practice vs. on paper? As with most new heroes and items in Dota, they don't always stick their landing.", callback);
		},
		function(callback) {
			postCreate("What is up with Chen?", 'KawaiiSocks', 'December 19, 2018', "Chen received one of the biggest reworks in patch 7.20, and the community is still debating how the hero should be played. He no longer has access to bigger creeps from the start of the game, but now he has tools for significant lane presence that make him pretty much a new hero.", callback);
		},
		function(callback) {
			postCreate("Carries in 7.20", 'KawaiiSocks', 'December 15, 2018', "The final part of our meta overview is going to be focused on the most consistent and popular carry heroes. These are the heroes we see the most in our pubs, and the ones we must be the most prepared to face.", callback);
		},
		function(callback) {
			postCreate("Offlaners in 7.20", 'KawaiiSocks', 'December 13, 2018', "7.20 brought several new offlaners and solidified positions of some old ones as well, making for a rather diverse and interesting meta. It also seemingly got rid of the meta with carries in the offlane—current offlane heroes are now predominantly utility cores.", callback);
		},
		function(callback) {
			postCreate("The Mid Heroes of Patch 7.20", 'Eggs', 'December 10, 2018', "While we still see some of the usual, mainstay heroes in the mid lane, patch 7.20 has also brought forth more heroes into the fold--both familiar and new.", callback);
		},
		function(callback) {
			postCreate("Supporting in 7.20", 'KawaiiSocks', 'December 5, 2018', "One of our biggest complaints about 7.19 overstaying its welcome was that the support meta got really stale by the end of the patch. There was only a handful of viable supports you could first- or second-pick in a regular pub match and not set your team up for a loss.", callback);
		},
		function(callback) {
			postCreate("Winners and Losers of Patch 7.20", 'Eggs', 'December 3, 2018', "Three weeks into 7.20 and we’ve already had three additional mini patches, but it hasn’t been enough to stem the trends of this patch’s best and worst heroes.", callback);
		},
	],
	//optional callback
	cb);
}

async.series([
	createPost
],
// Optional callback
function(err, results) {
	if (err) {
		console.log('FINAL ERR: '+err);
	}
	else {
		console.log('POSTIntances: '+posts);
	}
	// All done, disconnect from database
	mongoose.connection.close();
});
