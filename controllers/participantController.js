var Participant = require('../models/participant');

// Display list of all participants.
exports.participant_list = function(req, res) {
	res.send('NOT IMPLEMENTED: participant list');
};

// Display detail page for a specific roster
exports.participant_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: participant detail: ' + req.params.id);
}


