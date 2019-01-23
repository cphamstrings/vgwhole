var Player = require('../models/players');
var Participant = require('../models/participant');
var Match = require('../models/match');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


// Display list of all players.
exports.player_list = function(req, res) {
	Player.find({})
	.exec(function(err, list_player) {
		if(err) {return next(err)};
		// Successful so render
		res.render('players', { title: 'All Players', player_list: list_player});
	});
};

// Display detail page for a specific player.
exports.player_detail = function(req, res) {
	async.series({
		playerdetail: function(cb){
			Player.aggregate([
				{
					$match: {
						id: req.params.id
					}
					
				},
				{
					$project: {
						attributes: 1,
						totalPlayed: {$sum: ["$attributes.stats.gamesPlayed.aral", "$attributes.stats.gamesPlayed.blitz", "$attributes.stats.gamesPlayed.blitz_rounds", "$attributes.stats.gamesPlayed.casual", "$attributes.stats.gamesPlayed.casual_5v5", "$attributes.stats.gamesPlayed.ranked", "$attributes.stats.gamesPlayed.ranked_5v5"]},
						losses: {$subtract: [{$sum: ["$attributes.stats.gamesPlayed.aral", "$attributes.stats.gamesPlayed.blitz", "$attributes.stats.gamesPlayed.blitz_rounds", "$attributes.stats.gamesPlayed.casual", "$attributes.stats.gamesPlayed.casual_5v5", "$attributes.stats.gamesPlayed.ranked", "$attributes.stats.gamesPlayed.ranked_5v5"]} ,"$attributes.stats.wins"] },
						winRate: {$multiply: [{$divide : ["$attributes.stats.wins", {$sum: ["$attributes.stats.gamesPlayed.aral", "$attributes.stats.gamesPlayed.blitz", "$attributes.stats.gamesPlayed.blitz_rounds", "$attributes.stats.gamesPlayed.casual", "$attributes.stats.gamesPlayed.casual_5v5", "$attributes.stats.gamesPlayed.ranked", "$attributes.stats.gamesPlayed.ranked_5v5"]}] },100]}, 
					}
				}
			], function (err, recs){
			if(err){
				cb(err);
			} else {
				cb(null, recs);
				}
			});
		
		},

		playerhero: function(cb) {
			Participant.aggregate([
				
				{
					$match: {
						"relationships.player.data.id": req.params.id
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
				
				{ $unwind: "$hero_pop" },

				{
					$project: {
						"hero_pop.name": 1,
						"hero_pop.img": 1,
						"attributes.stats": 1,
						win: {$cond: [{$eq: ["$attributes.stats.winner", true] }, {$sum:1}, '']},
						loss: {$cond: [{$eq: ["$attributes.stats.winner", false]}, {$sum:1}, '']},
					}
				},
				
				{
					$group: {
						_id: { name: "$hero_pop.name",
							image: "$hero_pop.img"},
						played: { $sum: 1 },
						won: {$sum: "$win"},
						kills: {$sum: "$attributes.stats.kills"},
						assists: {$sum: "$attributes.stats.assists"},
						deaths: {$sum: "$attributes.stats.deaths"}
					}
				},

				{
					$project: {
						name: "$_id.name",
						image: "$_id.image",
						played: 1,
						won: 1,
						winrate: { 
							$multiply: [
								{$divide: ["$won", "$played"]},
								100
							]
						},
						kills: 1,
						assists: 1,
						deaths: 1,
						kda: {
							$cond: [{
								$eq: [ "$deaths", 0 ]
							},
								{ $divide: [ {
									$sum: ["$kills", "$assists"]
								},
									1 ]},
								{ $divide: [{
									$sum: ["$kills", "$assists"]},
									"$deaths"]}
							]},
					}
				},
				
				{
					$sort: {played: -1, winrate: -1}
				}

			], function (err, recs){
			if(err){
				console.log(err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})
		},

		matches_recent: function(cb) {
			Match.aggregate([
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
					$match: {
						"participant_pop.relationships.player.data.id" : req.params.id
					}
				},

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
					$project: {
						matchId: "$id",
						image: "$hero_pop.img",
						hero_name: "$hero_pop.name",
						kills: "$participant_pop.attributes.stats.kills",
						deaths: "$participant_pop.attributes.stats.deaths",
						assists: "$participant_pop.attributes.stats.assists",
						duration: "$attributes.duration",
						minutes: { $floor: { $divide: [ "$attributes.duration", 60] } },
						seconds: { $mod: ["$attributes.duration", 60] },
						date: "$attributes.createdAt",
						gameMode: "$attributes.gameMode",
						result: "$roster_pop.attributes.won"
					}
				}

				

			], function (err, recs) {
			if(err) {
				console.log(err);
				cb(err);
			} else {
				console.log(recs);
				cb(null, recs);
			}
			})
		}
	
	}, function(err, results) {
		if(err) {return next(err);}
		res.render('players_detail', {title: 'test', player: results.playerdetail, playerheroes: results.playerhero, recent_matches: results.matches_recent, playerid: req.params.id});
	});

	
}

exports.player_detail_matches = function(req, res) {
	async.parallel({
		totalMatches: function(cb) {
			Match.aggregate([
				{
					$project: {
						"id": 1,
						date: "$attributes.createdAt",
						duration: "$attributes.duration",
						mode: "$attributes.gameMode",
						rosters: "$relationships.rosters.data.id"

					}
				},
				
				{
					$lookup: {
						from: "rosters",
						localField: "rosters",
						foreignField: "id",
						as: "roster_pop"

					}
				},

				{
					$project: {
						"id": 1,
						"date": 1,
						"duration": 1,
						"mode": 1,
						participants: "$roster_pop.relationships.participants.data"
					}
				},

				{ $unwind: "$participants"},

				{
					$lookup: {
						from: "participants",
						localField: "participants.id",
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
					$project: {
						matchInfo: {
							matchId: "$id",
							matchDate: "$date",
							matchMode: "$mode",
							matchDuration: "$duration"
						},
						heroInfo: {
							participantHero: "$hero_pop.name",
							heroImage: "$hero_pop.img",
							heroId: "$hero_pop._id",
							heroRole: "$hero_pop.role"
						},
						participantStats: {
							participantKills: "$participant_pop.attributes.stats.kills",
							participantDeaths: "$participant_pop.attributes.stats.deaths",
							participantAssists: "$participant_pop.attributes.stats.assists",
							participantKDA: { $cond: [{
										$eq: [ "$participant_pop.attributes.stats.deaths", 0 ]
									},
										{ $divide: [ {
											$sum: ["$participant_pop.attributes.stats.kills", "$participant_pop.attributes.stats.assists"]
										},
											1]},
								{ $divide: [{
									$sum: ["$participant_pop.attributes.stats.kills", "$participant_pop.attributes.stats.assists"]},
									"$participant_pop.attributes.stats.deaths"]}
							]},
							participantGold: "$participant_pop.attributes.stats.gold",
							participantGoldPerMinute: { $divide: ["$participant_pop.attributes.stats.gold", 60 ] },
							participantCreepScore: "$participant_pop.attributes.stats.farm",
							participantMinionKills: "$participant_pop.attributes.stats.nonJungleMinionKills",
							participantJungleKills: "$participant_pop.attributes.stats.jungleKills",
							won: "$participant_pop.attributes.stats.winner",
							role: {
								$switch: {
									branches: [
										{ case: { $eq: ["$hero_pop.role", "Protector"] }, then: "captain"},
										{ case: { $gte: ["$participant_pop.attributes.stats.jungleKills", "$participant_pop.attributes.stats.nonJungleMinionKills"] }, then: "jungler" },
										{ case: { $gte: ["$participant_pop.attributes.stats.nonJungleMinionKills", "$participant_pop.attributes.stats.jungleKills"] }, then: "carry" }
									]
								}	
							}	
						     
						/*	role: {
								captain: { $cond: [{ $eq: ["$hero_pop.role", "Protector"] }, {$sum:1}, ''] },
								jungler: { $cond: [{ $gte: ["$participant_pop.attributes.stats.jungleKills", "$participant_pop.attributes.stats.nonJungleMinionKills"] }, {$sum:1}, '']},
								carry: { $cond: [{ $gte: ["$participant_pop.attributes.stats.nonJungleMinionKills", "$participant_pop.attributes.stats.jungleKills"] }, {$sum:1}, '']}
							}
					*/	},		
					
						player: "$participant_pop.relationships.player.data.id"
					}
				},

				{
					$lookup: {
						from: "players",
						localField: "player",
						foreignField: "id",
						as: "player_pop"
					}
				},

				{
					$match: {
						"player_pop.id" : req.params.id
					}
				},

				{ $unwind: "$player_pop"},

				{ 
					$project: {
						"matchInfo": 1,
						"heroInfo": 1,
						"participantStats": 1,
						playerInfo: {
							name: "$player_pop.attributes.name",
							gamesPlayed: "$player_pop.attributes.stats.gamesPlayed",
							rankPoints: "$player_pop.attributes.stats.rankPoints",
							wins: "$player_pop.attributes.stats.wins",
										
							totalPlayed: {$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]},
							losses: {$subtract: [{$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]} ,"$player_pop.attributes.stats.wins"] },
							winRate: {$multiply: [{$divide : ["$player_pop.attributes.stats.wins", {$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]}] },100]}, 

						},
						captainCount: { $cond: [{ $eq: ["$participantStats.role", "captain"] }, {$sum:1}, ''] },
						junglerCount: { $cond: [{ $eq: ["$participantStats.role", "jungler"] }, {$sum:1}, ''] },
						carryCount: { $cond: [{ $eq: ["$participantStats.role", "carry"] }, {$sum:1}, ''] },
					}
				},

				{
					$group: {
						_id: null,
						avgKills: { $avg: "$participantStats.participantKills" },
						avgDeaths: { $avg: "$participantStats.participantDeaths" },
						avgAssists: { $avg: "$participantStats.participantAssists" },
						avgKDA: { $avg: "$participantStats.participantKDA" },
						avgGPM: { $avg: "$participantStats.participantGoldPerMinute" },
						avgDuration: { $avg: "$matchInfo.matchDuration"},
						carryTotal: { $sum: "$carryCount"},
						junglerTotal: {$sum: "$junglerCount"},
						captainTotal: {$sum: "$captainCount"},
						matches: { $push: "$$ROOT" }
					}
				},
				
				{ $unwind: "$matches" },

				{ 
					$project: {
						"avgKills": 1,
						"avgDeaths": 1,
						"avgAssists": 1,
						"avgKDA": 1,
						"avgGPM": 1,
						"avgDuration": 1,
						roleTotal: {
							carry: "$carryTotal",
							jungler: "$junglerTotal",
							captain: "$captainTotal"
						},
						"matches": 1
					}
				}

			], function (err,recs) {
			if(err) {
				console.log(err);
				cb(err);
			} else {
				cb(null, recs);
			}
			})

		}
		
	}, function(err, results) {
		if(err) {return next(err);}
		res.render('players_detail_matches', {playerid: req.params.id, matchTotals: results.totalMatches});
	});

}

exports.player_detail_heroes = function (req, res) {
	async.parallel({
		playerHeroes: function(cb) {
			Participant.aggregate([
				
				{
					$match: {
						"relationships.player.data.id": req.params.id
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

				{ $unwind: "$hero_pop" },

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

						playerInfo: {
							name: "$player_pop.attributes.name",
							gamesPlayed: "$player_pop.attributes.stats.gamesPlayed",
							rankPoints: "$player_pop.attributes.stats.rankPoints",
							wins: "$player_pop.attributes.stats.wins",
										
							totalPlayed: {$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]},
							losses: {$subtract: [{$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]} ,"$player_pop.attributes.stats.wins"] },
							winRate: {$multiply: [{$divide : ["$player_pop.attributes.stats.wins", {$sum: ["$player_pop.attributes.stats.gamesPlayed.aral", "$player_pop.attributes.stats.gamesPlayed.blitz", "$player_pop.attributes.stats.gamesPlayed.blitz_rounds", "$player_pop.attributes.stats.gamesPlayed.casual", "$player_pop.attributes.stats.gamesPlayed.casual_5v5", "$player_pop.attributes.stats.gamesPlayed.ranked", "$player_pop.attributes.stats.gamesPlayed.ranked_5v5"]}] },100]}
						},

						heroInfo: {
							heroImage: "$hero_pop.img",
							heroName: "$hero_pop.name",
							won: {$cond: [{$eq: ["$attributes.stats.winner", true] }, {$sum:1}, '']},
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
								]
							},
							assists: "$attributes.stats.assists",
							gpm: 
								{ 
									$divide: [
										"$attributes.stats.gold", 60
									] 
								},
							role: {
								$switch: {
									branches: [
										{ case: { $eq: ["$hero_pop.role", "Protector"] }, then: "captain"},
										{ case: { $gte: ["$attributes.stats.jungleKills", "$attributes.stats.nonJungleMinionKills"] }, then: "jungler" },
										{ case: { $gte: ["$attributes.stats.nonJungleMinionKills", "$attributes.stats.jungleKills"] }, then: "carry" }
									]
								}	
							},
						
						}
					}
				},

				{
					$project: {
						"heroInfo": 1,
						"playerInfo": 1,
						captainCount: { $cond: [{ $eq: ["$heroInfo.role", "captain"] }, {$sum:1}, ''] },
						junglerCount: { $cond: [{ $eq: ["$heroInfo.role", "jungler"] }, {$sum:1}, ''] },
						carryCount: { $cond: [{ $eq: ["$heroInfo.role", "carry"] }, {$sum:1}, ''] }
 
					}
				},

				{ 
					$group: {
						_id: "$heroInfo.heroName",
						totalWins: { $sum: "$won" },
						gamesPlayed: { $sum: 1},
						avgKDA: { $avg: "$heroInfo.kda" },
						avgGPM: { $avg: "$heroInfo.gpm" },
						captainTotal: { $sum: "$captainCount" },
						junglerTotal: { $sum: "$junglerCount" },
						carryTotal: { $sum: "$carryCount" },
						heroes: { $addToSet : "$$ROOT" }
					}
				},

				{ $unwind: "$heroes" },

				{
					$project: {
						"_id": 1,
						winRate: { $divide: ["$totalWins", "$gamesPlayed"] },
						"avgKDA": 1,
						"avgGPM": 1,
						"gamesPlayed": 1,
						roleTotal: {
							carry: "$carryTotal",
							jungler: "$junglerTotal",
							captain: "$captainTotal"
						},
						playerInfo: "$heroes.playerInfo",
						heroInfo: "$heroes.heroInfo"
 
					}
				}

				
			], function(err, recs) {
			if(err) {
				console.log(err);
				cb(err);
			} else {
				console.log(recs);
				cb(null, recs);
			}
			})
		}

	}, function(err, results) {
		if(err) {return next(err);}
		res.render('players_detail_heroes', {playerId: req.params.id, heroPlayer: results.playerHeroes}  )
	
	});
}
