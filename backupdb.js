var backup = require('mongodb-backup');

backup({
	uri: 'mongodb uri here',
	root: "../Documents/mongodb_backup",
	callback: function(err) {
		if(err) {
			console.error(err);
		} else {
			console.log('finish')
		}
	}
})
