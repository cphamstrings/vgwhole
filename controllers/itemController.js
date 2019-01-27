var async = require('async');
var Participant = require('../models/participant')
var Item = require('../models/items');
var Match = require('../models/match');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// Display list of items
exports.item_list = function(req, res, next) {
	async.series({
		list_item: function(cb) {
			Participant.aggregate([
				{
					$unwind: "$attributes.stats.items"
				},
				
				{
					$lookup: {
						from: "items",
						localField: "attributes.stats.items",
						foreignField: "name",
						as: "item_pop"
					}
				},
			
				{ $unwind: "$item_pop" },

				{
					$project: {
						win: {$cond: [{$eq: ["$attributes.stats.winner", true] }, {$sum:1}, '']},
						loss: {$cond: [{$eq: ["$attributes.stats.winner", false] }, {$sum:1}, '']},
						itemName: "$item_pop.name",
						itemImage: "$item_pop.image",
						itemId: "$item_pop._id"
					}
				},

				{
					$group: {
						_id: {  id: "$itemId",
							name: "$itemName",
							image: "$itemImage"},
						timesUsed: { $sum: 1},
						won: {$sum: "$win"},
						lost: {$sum: "$loss"},

					}
				},

				{
					$project: {
						itemId: "$_id.id",
						itemName: "$_id.name",
						itemImage: "$_id.image",
						timesUsed: 1,
						won: 1,
						winrate: {
							$multiply: [
								{$divide: ["$won", "$timesUsed"]},
								100
							]
						}

					}
				},

				{
					$sort: {timesUsed: -1, winrate: -1}
				}

			], function (err, recs) {
				if(err) {
					console.log(err);
					cb(err);
				} else {
					cb(null, recs);
				}
			});
		},

		participantCount: function(cb) {
			Participant.aggregate([
				{
					$count: "totalParticipants"
				}
			], function (err, recs) {
				if(err) {
					console.log(err);
					cb(err);
				} else {
					cb(null, recs);
				}
			});
		}
		
	}, function(err, results) {
		if(err) {return next(err);}
		res.render('items', {title: 'test', items: results.list_item, count: results.participantCount});
	
	});

	
}


// Display item detail
exports.item_detail = function(req, res, next) {
	async.series({
		itemHero: function(cb) {
			Participant.aggregate([
				{ $unwind: "$attributes.stats.items"},

				{
					$lookup: {
						from: "items",
						localField: "attributes.stats.items",
						foreignField: "name",
						as: "item_pop"

					}
				},
					
				{ $unwind: "$item_pop" },

				{
					$match: {
						"item_pop._id": ObjectId(req.params.id)
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
						"item_pop": 1,
						"hero_pop.img": 1,
						"hero_pop.name": 1,
						"attributes.stats": 1,
						win: {$cond: [{$eq: ["$attributes.stats.winner", true] }, {$sum:1}, '']},
						loss: {$cond: [{$eq: ["$attributes.stats.winner", false]}, {$sum:1}, '']}

					}
				},

				{
					$group: {
						_id: { name: "$hero_pop.name",
							image: "$hero_pop.img"},
						used: { $sum: 1},
						won: {$sum: "$win"}
					}
				},

				{
					$project: {
						name: "$_id.name",
						image: "$_id.image",
						used: 1,
						won: 1,
						winrate: {
							$multiply: [
								{$divide: ["$won", "$used"]},
								100
							]
						}
					}
				},

				{
					$sort: { used: -1, winrate: -1}
				}


			], function (err, recs) {
				if(err) {
					console.log(err);
					cb(err);
				} else {
					cb(null, recs);
				}
			});
		},

		itemDetails: function(cb) {
			Item.aggregate([
				{
					$match: {
						_id: ObjectId(req.params.id)
					}
				},
				
				{ $unwind: { path: "$buildFrom", preserveNullAndEmptyArrays: true }},
				{ $unwind: { path: "$buildInto", preserveNullAndEmptyArrays: true }},
				{
					$lookup: {
						from: "items",
						foreignField: "_id",
						localField: "buildInto",
						as: "buildsInto"
					}
				},

				{
					$lookup: {
						from: "items",
						foreignField: "_id",
						localField: "buildFrom",
						as: "buildsFrom"
					}
				}

			], function(err, recs) {
				if(err) {
					console.log(err);
					cb(err);
				} else {
					cb(null, recs);
				}
			});
		},

		popularityWinrate: function(cb) {
			Participant.aggregate([
				{
					$project: {
						winner: "$attributes.stats.winner",
						items: "$attributes.stats.items"
					}
				},
		
				{ $unwind: "$items" },
			
				{ 
					$lookup: {
						from: "items",
						foreignField: "name",
						localField: "items",
						as: "item_pop"
					}
				},

				{ $unwind: "$item_pop" },

				{
					$project: {
						win: {$cond: [{$eq: ["$winner", true] }, {$sum:1}, '']},
						loss: {$cond: [{$eq: ["$winner", false] }, {$sum:1}, '']},
						itemId: "$item_pop._id"
					}
				},
				

				{
					$group: {
						_id: "$itemId",
						won: {$sum: "$win"},
						used: {$sum: 1},
						
					}
				},

				{
					$project: {
						"_id": 1,
						"won": 1,
						"used": 1,
						 winrate: {
							$multiply: [
								{$divide: ["$won", "$used"]},
								100
							]
						}

					}
				},

				{
					$sort: { used: -1, winrate: -1 }
				},

				{
					$group: {
						"_id": false,
						"items": {
							"$push": {
								"_id": "$_id",
								"won": "$won",
								"used": "$used",
								"winrate": "$winrate"
							}
						}
					}
				},
				
				{
					$unwind: {
						"path": "$items",
						"includeArrayIndex": "ranking"
					}

				},

				{
					$match: {
						"items._id": ObjectId(req.params.id)
					}
				},

				{
					$project: {
						winrate: "$items.winrate",
						"popularity": {$sum: ["$ranking", 1] }
					}
				}


			], function(err, recs) {
				if(err) {
					console.log(err);
					cb(err);
				} else {
					cb(null, recs);
				}
			})
		},

		weekly: function(cb) {
			var today = new Date(),
				oneDay = ( 1000 * 60 * 60 * 24),
				thirtyDays = new Date( today.valueOf() - ( 60 * oneDay ) ),
				fifteenDays = new Date( today.valueOf() - ( 15 * oneDay) ),
				sevenDays = new Date( today.valueOf() - ( 7 * oneDay ) );
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
				
				{ $unwind: "$participant_pop" },

				{
					$group: {
						_id: { month: "$month", day: "$day" },
						total: { $sum: 1},
						participants: { $addToSet: "$participant_pop" },
							
					}
				},

				{ $unwind: "$participants" },

				{
					$lookup: {
						from: "items",
						localField: "participants.attributes.stats.items",
						foreignField: "name",
						as: "item_pop"
					}
				},
				
				{ $unwind: "$item_pop" },

				{
					$match: {
						"item_pop._id": ObjectId(req.params.id)
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
						used: { $sum: 1 },
						total: { $addToSet: "$total" },
						wins: { $sum: "$won" }
					}
				},

				{ $unwind: "$total" },

				{
					$sort: { "_id.day" : 1 }
				},

				{
					$project: {
						winrate: { $multiply: [
							{ $divide: ["$wins", "$used" ] },
							100 ] },

						pickrate: { $multiply: [
							{ $divide: ["$used", "$total" ] },
							100 ] }
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
		},
	},	
	function(err, results) {
		if(err) {return next(err);}
		res.render('items_detail', {itemHero: results.itemHero, itemDetail: results.itemDetails, popularity: results.popularityWinrate, weekly: JSON.stringify(results.weekly)});
	});
		
}
