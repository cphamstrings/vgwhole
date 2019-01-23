var Blog = require('../models/blogposts');

// Display list of all blog posts.
exports.post_list = function(req, res, next) {
	Blog.find({})
	.exec(function(err, list_post) {
		res.render('index', {post_list: list_post});
		
	});
};

// Display detail page for a specific post.
exports.post_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: Post detail: ' + req.params.id);
};
