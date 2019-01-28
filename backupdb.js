var backup = require('mongodb-backup');

backup({
	uri: 'mongodb://cphamstrings:cdp10409@ds263837.mlab.com:63837/vainglory',
	root: "../Documents/mongodb_backup",
	callback: function(err) {
		if(err) {
			console.error(err);
		} else {
			console.log('finish')
		}
	}
})
