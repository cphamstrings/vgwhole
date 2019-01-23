var Match = require('../models/match');
var Rosters = require('../models/rosters');
var Participants = require('../models/participant');
var async = require('async');

// Display list of all matches.
exports.match_list = function(req, res, next) {
	Match.find({})
		.populate({
			path: 'rosters',
			populate: {
				path: 'participant',
				model: 'participants',
				populate: {
					path: 'hero',
					model: 'heroes'
				}
			}
		})
		.exec(function(err, list_match) {
			if(err) {return next(err)};
			
			// Successful, so render
		
	
			res.render('matches', { title: 'Matches', match_list: list_match});
		});	
};

// Display detail page for a specific match.
exports.match_detail = function(req, res) {
	async.series({
		matchdetail: function(cb) {
			Match.aggregate([
				{
					$match: {
						id: req.params.id	
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

				{ $unwind: "$participant_pop"},
				
				{
					$lookup: {
						from: "players",
						localField: "participant_pop.relationships.player.data.id",
						foreignField: "id",
						as: "player_pop"
					}
				},

				{ $unwind: "$player_pop" },

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
					$lookup: {
						from: "items",
						localField: "participant_pop.attributes.stats.items",
						foreignField: "name",
						as: "item_pop"
						}
				},

				{
					$project: {
						id: 1,
						side: "$roster_pop.attributes.stats.side",
						heroImage: "$hero_pop.img",
						heroName: "$hero_pop.name",
						playerId: "$player_pop.id",
						playerName: "$player_pop.attributes.name",
						playerKills: "$participant_pop.attributes.stats.kills",
						playerDeaths: "$participant_pop.attributes.stats.deaths",
						playerAssists: "$participant_pop.attributes.stats.assists",
						minionKills: "$participant_pop.attributes.stats.minionKills",
						goldEarned: "$participant_pop.attributes.stats.gold",
						mineCaptures: "$participant_pop.attributes.stats.goldMineCaptures",
						items: "$item_pop",
						turretCaptures: "$participant_pop.attributes.stats.turretCaptures",
						gameMode: "$attributes.gameMode",
						region: "$attributes.shardId",
						minutes: { $floor: { $divide: [ "$attributes.duration", 60] }},
						seconds: { $mod: ["$attributes.duration", 60] },
						date: "$attributes.createdAt"


					}
				}

			], function (err, recs) {
			if(err){
				cb(err);
			} else {
				cb(null, recs);
				}
			});
		},

		matchTotal: function(cb) {
			Match.aggregate([
				
				{
					$match: {
						id: req.params.id	
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
					$project: {
						participantCreepScore: "$participant_pop.attributes.stats.minionKills",
						participantMines: "$participant_pop.attributes.stats.mineCaptures",
						towers: "$roster_pop.attributes.stats.turretKills",
						kills: "$roster_pop.attributes.stats.heroKills",
						gold: "$roster_pop.attributes.stats.gold",
						participantAssists: "$participant_pop.attributes.stats.assists",
						participantDeaths: "$participant_pop.attributes.stats.deaths",
						side: "$roster_pop.attributes.stats.side",
						winner: "$roster_pop.attributes.won",

					}
				},

				{
					$group: {
						_id: "$side",
						creepScore: {$sum: "$participantCreepScore"},
						assists: {$sum: "$participantAssists"},
						mines: {$sum: "$participantMines"},
						deaths: {$sum: "$participantDeaths"},
						stats: {
							$addToSet: {
								kills: "$kills",
								gold: "$gold",
								towers: "$towers",
								winner: "$winner"
							}
						}
					}
				},

				{ $unwind: "$stats" }


			], function (err, recs) {
			if(err){
				cb(err);
			} else {
				console.log(recs);
				cb(null, recs);
				}
			});
		},

	}, function (err, results) {
		res.render('match_detail', {title: 'test', match: results.matchdetail, matchTotal: results.matchTotal});
	});
};


