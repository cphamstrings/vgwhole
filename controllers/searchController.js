var Match = require('../models/match');
var Participants = require('../models/participant');
var Hero = require('../models/heroes');
var Player = require('../models/players');
var Item = require('../models/items');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.search = [
	// Validate that the field is not empty
	body('q', 'Empty search is not smart').isLength({ min: 1}).trim(),

	// Sanitize (trim and escape) the field.
	sanitizeBody('q').trim().escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		async.series({
			playerSearch: function(cb) {
				Player.aggregate([
					
					{
						$match: {
							"attributes.name": {$regex: req.query.q, $options: 'i'}
						}
					}

				], function (err, recs) {
				if(err) {
					cb(err);
				} else {
					cb(null, recs);
					}
				})
			},

			heroSearch: function(cb) {
				Hero.aggregate([

					{
						$match: {
							"name": {$regex: req.query.q, $options: 'i'}
						}
					}

				], function (err, recs) {
				if (err) {
					cb(err);
				} else {
					cb(null, recs);
					}
				})
			},

			matchSearch: function(cb) {
				Match.aggregate([
					
					{
						$match: {
							"id": req.query.q
						}
					}

				], function (err, recs) {
				if (err) {
					cb(err);
				} else {
					cb(null, recs);
					}
				})
			},

			rosterSearch: function(cb) {
				Match.aggregate([
				
					{
						$match: {
							"id": req.query.q
						}
					},

					{
						$lookup: {
							from: "rosters",
							localField: "relationships.rosters.data.id",
							foreignField: "id",
							as: "roster_pop"
						}
					},

					{ $unwind: "$roster_pop" },

					{ 
						$lookup: {
							from: "participants",
							localField: "roster_pop.relationships.participants.data.id",
							foreignField: "id",
							as: "participant_pop"
						}
					},
					
					{ $unwind: "$participant_pop" },

					{
						$lookup: {
							from: "heroes",
							localField: "participant_pop.attributes.actor",
							foreignField: "name",
							as: "hero_pop"
						}
					},

					{ $unwind: "$hero_pop" },

					{ 
						$group: {
							_id: "$roster_pop.id",
							heroes: { $addToSet: "$hero_pop" }
						}
					}
			

				], function (err, recs) {
				if(err) {
					cb(err);
				} else {
					cb(null, recs);
					}
				})
			},

			itemSearch: function(cb) {
				Item.aggregate([
					
					{
						$match: {
							"name": {$regex: req.query.q, $options: 'i'}
						}
					}

				], function (err, recs) {
				if (err) {
					cb(err);
				} else {
					cb(null, recs);
					}
				})
			},

		}, function(err, results) {
			if(err) {return next(err);}
			console.log(results);
			res.render('search', { itemSearch : results.itemSearch, playerSearch: results.playerSearch, heroSearch: results.heroSearch, matchSearch: results.matchSearch, rosterSearch: results.rosterSearch});
		});
	}
	
]
