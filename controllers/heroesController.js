var Hero = require('../models/heroes');
var Ability = require('../models/abilities');
var Match = require('../models/match');
var Roster = require('../models/rosters');
var Participant = require('../models/participant');
var async = require ('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var debug = require('debug')('heroes');

// Display list of all heroes
exports.heroes_list = function(req, res, next) {
	Hero.find({})
	.sort('name')
	.exec(function(err, list_hero) {
		if(err) {
			debug('get error:' + err);
			return next(err)
		};
		// Successful so render
		res.render('heroes', { title: 'All Heroes - ', hero_list: list_hero });
	});
};

exports.hero_detail = function(req, res, next) {
	async.parallel({
		heroesOverview: function(cb) {
			Hero.aggregate([
				{
					$match: {
						"name": {$regex: req.params.name, $options: 'i'}
					}
				}

			], function (err, recs) {
			if(err) {
				debug('get details error:' + err);
				cb(err);
			} else {
	
				cb(null, recs);
			}
			})

		},

		heroesItems: function(cb) {
			Participant.aggregate([

				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}
					}
				},

				{
					$project: {
					
						items: "$attributes.stats.items",
						won: { $cond: [{ $eq: ["$attributes.stats.winner", true]}, {$sum:1}, '']}

					}
				},

				{
					$lookup: {
						from: "items",
						localField: "items",
						foreignField: "name",
						as: "item_pop"
					}
				},
				
				{ $unwind: "$item_pop" },

				{
					$project: {
						name: "$item_pop.name",
						image: "$item_pop.image",
						id: "$item_pop._id",
						"won": 1,
					}
				},

				{
					$group: {
						_id: "$name",
						id: { $addToSet: "$id" },
						wins: {$sum: "$won" },
						timesUsed: {$sum: 1},
						image: { $addToSet: "$image" }
					}
				},
				
				{ $unwind: "$id" },
				{ $unwind: "$image" },

				{
					$project: {
						name: "$_id",
						id: "$id",
						image: "$image",
						timesUsed: "$timesUsed",
						wins: "$wins",
						winrate:  {$multiply: [{ $divide: ["$wins", "$timesUsed"] }, 100 ]} 

					}
				},

				{ $sort: { timesUsed : -1 } },

				{ $limit: 10 }

			], function (err, recs) {
			if(err) {
				debug('get hero items error:' + err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},

		heroesMatchup: function(cb) {
			
			Participant.aggregate([
			
				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}

					}
				},

				{
					$lookup: {
						from: "rosters",
						localField: "id",
						foreignField: "relationships.participants.data.id",
						as: "roster_pop"
					}
				},

				{
					$unwind: "$roster_pop"
				},

				{
					$lookup: {
						from: "matches",
						localField: "roster_pop.id",
						foreignField: "relationships.rosters.data.id",
						as: "match_pop"
					}
				},

				{ $unwind: "$match_pop"},

				{
					$project: {
						hero: "$attributes.actor",
						won: { $cond: [{ $eq: ["$attributes.stats.winner", true]}, {$sum:1}, '']},
						friendlyRoster: "$roster_pop.id",
						enemyRoster: { 
							$cond: [
								{
									$eq: [
										"$roster_pop.id",
										{ $arrayElemAt: [ "$match_pop.relationships.rosters.data.id", 0 ] }
									]
								},
									{ $arrayElemAt: ["$match_pop.relationships.rosters.data.id", 1] },
								{ $arrayElemAt: ["$match_pop.relationships.rosters.data.id", 0] }

							]
					
						
						}	
					}
				},

				{
					$lookup: {
						from: "rosters",
						localField: "enemyRoster",
						foreignField: "id",
						as: "enemyRoster"
					}
				},

				{
					$lookup: {
						from: "participants",
						localField: "enemyRoster.relationships.participants.data.id",
						foreignField: "id",
						as: "participants"
					}
				},
			
				{ $unwind: "$participants" },

				{
					$project: {
						enemyHero: "$participants.attributes.actor",
						enemyWon: { $cond: [{ $eq: ["$participants.attributes.stats.winner", true]}, {$sum:1}, '']}

					}
				},

				{
					$group: {
						_id: "$enemyHero",
						wins: {$sum: "$enemyWon"},
						played: {$sum: 1}
					}
				},

				{
					$project: {
						hero: "$_id",
						"wins": 1,
						"played": 1,
						winrate: {$subtract: [100, { $multiply: [{ $divide: ["$wins", "$played"] }, 100] }]}
					}
				},
	
				{
					$sort: { "played": -1 }
				},

				{
					$lookup: {
						from: "heroes",
						localField: "hero",
						foreignField: "name",
						as: "heroInfo"
					}
				},
				
				{ $unwind: "$heroInfo" },

				{
					$project: {
						name: "$heroInfo.name",
						image: "$heroInfo.img",
						"winrate": 1,
						"played": 1,
					}
				},

				{ $sort: {"winrate" : -1, "played": -1} },

				{ $limit: 10 }

			], function (err, recs) {
			if(err) {
				debug('get matchups error:' + err);
				cb(err);
			} else {
				
				cb(null, recs);
			}
			})

		},

		
		worstVersus: function(cb) {
			
			Participant.aggregate([
			
				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}

					}
				},

				{
					$lookup: {
						from: "rosters",
						localField: "id",
						foreignField: "relationships.participants.data.id",
						as: "roster_pop"
					}
				},

				{
					$unwind: "$roster_pop"
				},

				{
					$lookup: {
						from: "matches",
						localField: "roster_pop.id",
						foreignField: "relationships.rosters.data.id",
						as: "match_pop"
					}
				},

				{ $unwind: "$match_pop"},

				{
					$project: {
						hero: "$attributes.actor",
						won: { $cond: [{ $eq: ["$attributes.stats.winner", true]}, {$sum:1}, '']},
						friendlyRoster: "$roster_pop.id",
						enemyRoster: { 
							$cond: [
								{
									$eq: [
										"$roster_pop.id",
										{ $arrayElemAt: [ "$match_pop.relationships.rosters.data.id", 0 ] }
									]
								},
									{ $arrayElemAt: ["$match_pop.relationships.rosters.data.id", 1] },
								{ $arrayElemAt: ["$match_pop.relationships.rosters.data.id", 0] }

							]
					
						
						}	
					}
				},

				{
					$lookup: {
						from: "rosters",
						localField: "enemyRoster",
						foreignField: "id",
						as: "enemyRoster"
					}
				},

				{
					$lookup: {
						from: "participants",
						localField: "enemyRoster.relationships.participants.data.id",
						foreignField: "id",
						as: "participants"
					}
				},
			
				{ $unwind: "$participants" },

				{
					$project: {
						enemyHero: "$participants.attributes.actor",
						enemyWon: { $cond: [{ $eq: ["$participants.attributes.stats.winner", true]}, {$sum:1}, '']}

					}
				},

				{
					$group: {
						_id: "$enemyHero",
						wins: {$sum: "$enemyWon"},
						played: {$sum: 1}
					}
				},

				{
					$project: {
						hero: "$_id",
						"wins": 1,
						"played": 1,
						winrate: {$subtract: [ 100, { $multiply: [{ $divide: ["$wins", "$played"] }, 100] } ]}
					}
				},
	
				{
					$sort: { "played": -1 }
				},

				{
					$lookup: {
						from: "heroes",
						localField: "hero",
						foreignField: "name",
						as: "heroInfo"
					}
				},
				
				{ $unwind: "$heroInfo" },

				{
					$project: {
						name: "$heroInfo.name",
						image: "$heroInfo.img",
						"winrate": 1,
						"played": 1,
					}
				},

				{ $sort: {"winrate" : 1, "played": -1 } },

				{ $limit: 10 }

			], function (err, recs) {
			if(err) {
				debug('get worstversus error:' + err);
				cb(err);
			} else {
				
				cb(null, recs);
			}
			})

		},
		
		weekly: function(cb) {
			var today = new Date(),
				oneDay = ( 1000 * 60 * 60 * 24),
				thirtyDays = new Date( today.valueOf() - ( 60 * oneDay) ),
				fifteenDays = new Date( today.valueOf() - ( 15 * oneDay) ),
				sevenDays = new Date( today.valueOf() - ( 7 * oneDay) );
			
			Match.aggregate([
			
				{
					$project: {
						date: {
							$dateFromString: {
								dateString: "$attributes.createdAt"
							}
						},
						rosterid: "$relationships.rosters.data.id"
					}
				},

				{
					$match: {
						"date": { $gte: sevenDays }
					}
				},

				{
					$lookup: {
						from: "rosters",
						localField: "rosterid",
						foreignField: "id",
						as: "roster_pop"
					}
				},

				{ $unwind: "$roster_pop" },

				{ 
					$project: {
						month: { $month: "$date" },
						day: { $dayOfMonth: "$date"},
						participantid: "$roster_pop.relationships.participants.data.id"
					}
				},

				{
					$lookup: {
						from: "participants",
						localField: "participantid",
						foreignField: "id",
						as: "participant_pop"
					}
				},

				{
					$project: {
						"month": 1,
						"day": 1,
						"participant_pop": 1
					}
				},

				{
					$group: {
						_id: { month: "$month", day: "$day" },
						total: { $sum: 1 },
						participants: { $addToSet: "$participant_pop" }
					}
				},

				{
					$unwind: "$participants"
				},

				{
					$unwind: "$participants"
				},

				{
					$match: {
						"participants.attributes.actor": {$regex: req.params.name, $options: 'i'}

					}
				},

				{
					$project: {
						won: { $cond: [{ $eq: ["$participants.attributes.stats.winner", true]}, {$sum:1}, '']},
						"total": 1		
					}
				},

				{
					$group: {
						_id: "$_id",
						wins: { $sum: "$won" },
						played: { $sum: 1 },
						total: { $addToSet: "$total" }
					}
				},

				{ $unwind: "$total" },

				{ 
					$sort: { "_id.day" : 1 }
				},

				{
					$project: {
						
						winrate: { $multiply: [ 
							{ $divide: ["$wins", "$played" ] },
							100 ] },

						pickrate: { $multiply: [
							{ $divide: ["$played", "$total" ] },
							100 ] }

					}
				}
				


			], function (err, recs) {
			if(err) {
				debug('get weekly stats error:' + err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})

		},

		statSpread: function(cb) {
			Participant.aggregate([
			
				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}

					}
				},

				{
					$group: {
						_id: null,
						avgKills: { $avg: "$attributes.stats.kills" },
						avgDeaths: { $avg: "$attributes.stats.deaths" },
						avgAssists: { $avg: "$attributes.stats.assists" },
						avgTowerKills: { $avg: "$attributes.stats.turretCaptures" },
						avgMinionKills: { $avg: "$attributes.stats.minionKills"}
					}
				}

			], function(err, recs) {
			if(err) {
				debug('get stats spread error:' + err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},

		roleDistribution: function(cb) {
			Participant.aggregate([
				
				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}
					}
				},

				{
					$lookup: {
						from: "heroes",
						localField: "attributes.actor",
						foreignField: "name",
						as: "hero_pop"
					}
				},

				{ $unwind: "$hero_pop"},

				{
					$project: {
						role: {
							$switch: {
								branches: [
									{ case: { $eq: ["$hero_pop.role", "Protector"] }, then: "captain"},
									{ case: { $gte: ["$attributes.stats.jungleKills", "$attributes.stats.nonJungleMinionKills"] }, then: "jungler" },
									{ case: { $gte: ["$attributes.stats.nonJungleMinionKills", "$attributes.stats.jungleKills"] }, then: "carry" }
								],
								default: "captain"
							}
						}
					}
				},

				{
					$project: {
						captainCount: { $cond: [{ $eq: ["$role", "captain"] }, {$sum:1}, ''] },
						junglerCount: { $cond: [{ $eq: ["$role", "jungler"] }, {$sum:1}, ''] },
						carryCount: { $cond: [{ $eq: ["$role", "carry"] }, {$sum:1}, ''] }
					}
				},

				{
					$group: {
						_id: req.params.name,
						captainTotal: {$sum: "$captainCount" },
						junglerTotal: {$sum: "$junglerCount" },
						carryTotal: {$sum: "$carryCount" }
					}
				}

			], function(err, recs) {
			if(err) {
				debug('get role distribution error:' + err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},

	}, function(err, results) {
		if(err) {return next(err);}
		res.render('heroes_detail', { title: req.params.name + ' - Overview - ', overview: results.heroesOverview, items: results.heroesItems, matchups: results.heroesMatchup, worstVersus: results.worstVersus, weekly: JSON.stringify(results.weekly), statSpread: JSON.stringify(results.statSpread), roleDistribution: JSON.stringify(results.roleDistribution)})
	})
}


// Display items page for a specific hero
exports.hero_items = function(req, res, next) {
	async.parallel({

		heroesItems: function(cb) {
			Participant.aggregate([

				{
					$match: {
						"attributes.actor": {$regex: req.params.name, $options: 'i'}
					}
				},

				{
					$project: {
					
						items: "$attributes.stats.items",
						won: { $cond: [{ $eq: ["$attributes.stats.winner", true]}, {$sum:1}, '']}

					}
				},

				{
					$lookup: {
						from: "items",
						localField: "items",
						foreignField: "name",
						as: "item_pop"
					}
				},
				
				{ $unwind: "$item_pop" },

				{
					$project: {
						name: "$item_pop.name",
						id: "$item_pop._id",
						image: "$item_pop.image",
						"won": 1,
					}
				},

				{
					$group: {
						_id: "$name",
						wins: {$sum: "$won" },
						timesUsed: {$sum: 1},
						image: { $addToSet: "$image" },
						id: { $addToSet: "$id" }
					}
				},

				{ $unwind: "$id" },
				{ $unwind: "$image" },

				{
					$project: {
						name: "$_id",
						id: "$id",
						image: "$image",
						timesUsed: "$timesUsed",
						wins: "$wins",
						winrate:  {$multiply: [{ $divide: ["$wins", "$timesUsed"] }, 100 ]} 

					}
				},

				{ $sort: { timesUsed : -1 } }

			], function (err, recs) {
			if(err) {
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},


		heroOverview: function(cb) {
			Hero.aggregate([
				{
					$match: {
						"name": {$regex: req.params.name, $options: 'i'}
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

	}, function(err, results) {
		if(err) {return next(err);}
		res.render('heroes_detail_items', { title: req.params.name + ' - Items - ', overview: results.heroOverview, items: results.heroesItems});
	})
}

// Display player ranking for a specific hero
exports.hero_detail_players = function(req, res, next) {
	async.parallel({
		heroPlayers: function(cb) {
			Participant.aggregate([

				{
					$match: {
						"attributes.actor":  {$regex: req.params.name, $options: 'i'}

					}
				},

				{
					$lookup: {
						from: "players",
						localField: "relationships.player.data.id",
						foreignField: "id",
						as: "player_pop"
					}
				},

				{ $unwind: "$player_pop" },	

				{
					$project: {
						name: "$player_pop.attributes.name",
						id: "$player_pop.id",
						region: "$player_pop.attributes.shardId",
						tier: "$player_pop.attributes.stats.skillTier",
						won: { $cond: [{ $eq: ["$attributes.stats.winner", true]}, {$sum:1}, '']},
						kda: { $cond: [{
							$eq: [ "$attributes.stats.deaths", 0 ]
						     },
							{ $divide: [ {
								$sum: ["$attributes.stats.kills", "$attributes.stats.assists"]
							},
								1]},
							{ $divide: [{
								$sum: ["$attributes.stats.kills", "$attributes.stats.assists"]},
								"$attributes.stats.deaths"]}
						]},

					}
				},

				{
					$group: {
						_id: "$name",
						id: { $addToSet: "$id"},
						wins: { $sum: "$won" },
						kda: { $avg: "$kda" },
						played: {$sum: 1},
						tier: {
							$addToSet: "$tier"
						}
					}
				},

				{ $unwind: "$tier" },
				{ $unwind: "$id"},

				{
					$project: {
						name: "$_id",
						id: "$id",
						"wins": 1,
						"kda": 1,
						"played": 1,
						"tier": 1,
						winrate: {$multiply: [ 100,  {$divide: ["$wins", "$played"] } ] }
					}
				},

				{ $sort: { tier: -1, winrate: -1, played: -1 } },

				{ $limit: 100 }

			], function (err, recs) {
			if(err) {
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},

		heroOverview: function(cb) {
			Hero.aggregate([
				{
					$match: {
						"name": {$regex: req.params.name, $options: 'i'}

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
	}, function(err, results) {
		if(err) { debug('get heroes players error:' + err); return next(err);}
		res.render('heroes_detail_players', { title: req.params.name + ' - Players - ', players: results.heroPlayers, overview: results.heroOverview })
	})
}

// Display detail page for a specific hero.
exports.hero_detail_abilities = function(req, res, next) {

	Hero.findOne({ 'name': new RegExp(req.params.name, "i")})
	.populate('abilities')
	.exec(function(err, hero_detail) {
		
		if(err) { debug('get hero abilities error:' + err); return next(err)};
		// Successful so render
		res.render('heroes_detail_abilities', { title: hero_detail.name + ' - Abilities - ', hero: hero_detail})
	}); 
}; 
