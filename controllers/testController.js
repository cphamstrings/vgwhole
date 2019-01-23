var Match = require('../models/match');

exports.test = function(req, res, next) {
	
	Match.aggregate([
		{ $lookup: {
			from: "rosters",
			localField: "relationships.rosters.data.id",
			foreignField: "id",
			as: "roster_pop",
		}}, 
		{ $lookup: {
			from: "participants",
			localField: "roster_pop.relationships.participants.data.id",
			foreignField: "id",
			as: "participant_pop"
		}},
		
		{ $unwind: "$participant_pop" },

		{ $lookup: 
			{
				from: "heroes",
				localField: "participant_pop.attributes.actor",
				foreignField: "name",
				as: "hero_pop"
			}
		},

		{ $unwind: "$hero_pop" },

		{
			$project: {
				"hero_pop.img": 1,
				"participant_pop.attributes.stats": 1,
				win: {$cond: [{$eq: ["$participant_pop.attributes.stats.winner", true] }, {$sum: 1}, '']},
				loss: {$cond: [{$eq: ["$participant_pop.attributes.stats.winner", false] }, {$sum: 1}, '']},

			}	
		},

		{
			$group: {
				_id: { name: "$participant_pop.attributes.actor",
					image: "$hero_pop.img"},
				played: { $sum: 1},
				won: {$sum: "$win"},
				k: {$sum: "$participant_pop.attributes.stats.kills"},
				a: {$sum: "$participant_pop.attributes.stats.assists"},
				d: {$sum: "$participant_pop.attributes.stats.deaths"}

			}


		},
		{
			$project: {
				name: "$_id.name",
				image: "$_id.image",
				played: "$played",
				won: "$won",
				rate: {$divide: ["$won", "$played"]},
				kills: "$k",
				assists: "$a",
				deaths: "$d",
				kda: {$divide: [{$sum: ["$k", "$a"]}, 1 ] },
				test: {	
					$cond: [ {
							$eq: [ "$d", 0 ] 
					},
						{ $divide: [ {
							$sum: ["$k", "$a"]
						},
							1 ] },
						{ $divide: [ {
							$sum: ["$k", "$a"]},
							"$d"]}
					]},

			}
		} 
		
	]).
		then(function (response) {
			res.render('test', { title: 'test', test: response});
		})
}
