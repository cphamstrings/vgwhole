var express = require('express');
var router = express.Router();

// Require controller modules.
var match_controller = require('../controllers/matchController');
var players_controller = require('../controllers/playersController');

// MATCH ROUTES //

// GET request for one match.
router.get('/match/:id', match_controller.match_detail);

// GET request for list of all matches.
router.get('/matches', match_controller.match_list);

// Player ROUTES //

// GET request for one player
router.get('/player/:id', players_controller.player_detail);

// GET request for list of all players.
router.get('/players', players_controller.player_list);

module.exports = router;
