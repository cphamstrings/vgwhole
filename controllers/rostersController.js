var Roster = require('../models/rosters');

// Display list of all rosters.
exports.roster_list = function(req, res) {
	res.send('NOT IMPLEMENTED: Roster list');
};

// Display detail page for a specific roster.
exports.roster_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: Roster detail: ' + req.params.id);
};
