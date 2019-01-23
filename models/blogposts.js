var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
	{
		title: {type: String, required: true},
		author: {type: String, required: true},
		date: {type: Date},
		summary: {type: String, required: true},
		content: {type: String},
		image: {type: String}
	}
);

// Virtual for post URL
PostSchema
	.virtual('url')
	.get(function () {
		return '/post/' + this._id;
	});

//Export model
module.exports = mongoose.model('posts', PostSchema);
