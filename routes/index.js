var express = require('express');
var router = express.Router();

// Require controller modules.
var match_controller = require('../controllers/matchController');
var players_controller = require('../controllers/playersController');
var heroes_controller = require('../controllers/heroesController');
var blog_controller = require('../controllers/blogController');
var test_controller = require('../controllers/testController');
var items_controller = require('../controllers/itemController');

/* GET home page. */
router.get('/', blog_controller.post_list);


// GET request for test data.
router.get('/test', test_controller.test);

// MATCH ROUTES //

// GET request for one match.
router.get('/matches/:id', match_controller.match_detail);

// GET request for a list of all matches.
router.get('/matches', match_controller.match_list);


// PLAYER ROUTES //

// GET request for one player
router.get('/players/:id', players_controller.player_detail);

// GET request for heroes of one player
router.get('/players/:id/heroes', players_controller.player_detail_heroes);

// GET request for list of all players.
router.get('/players', players_controller.player_list);

// GET request for matches of one player
router.get('/players/:id/matches', players_controller.player_detail_matches);



// HERO ROUTES //


// GET request for players of one hero
router.get('/heroes/:name/players', heroes_controller.hero_detail_players);

// GET request for items of one hero
router.get('/heroes/:name/items', heroes_controller.hero_items);

// GET request for list of all heroes.
router.get('/heroes', heroes_controller.heroes_list);

// GET request for one hero
router.get('/heroes/:name', heroes_controller.hero_detail);

// GET request for one hero abilities
router.get('/heroes/:name/abilities', heroes_controller.hero_detail_abilities);


// BLOG POST ROUTES //

// GET request for list of all posts.
router.get('/blog', blog_controller.post_list);

// GET request for one post.
router.get('/blog/:id', blog_controller.post_detail);

// ITEM ROUTES //


//GET request for list of items.
router.get('/items', items_controller.item_list);
router.get('/items/:id', items_controller.item_detail);

module.exports = router;
