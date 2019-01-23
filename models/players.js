var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		type: {type: String},
		id: String,
		attributes: {
			name: String,
			patchVersion: String,
			shardId: String,
			stats: {
				elo_earned_season_4: Number,
				elo_earned_season_5: Number,
				elo_earned_season_6: Number,
				elo_earned_season_7: Number,
				elo_earned_season_8: Number,
				elo_earned_season_9: Number,
				gamesPlayed: {
					aral: Number,
					blitz: Number,
					blitz_rounds: Number,
					casual: Number,
					casual_5v5: Number,
					ranked: Number,
					ranked_5v5: Number
				},
				guildTag: String,
				karmaLevel: Number,
				level: Number,
				lifetimeGold: Number,
				lossStreak: Number,
				played: Number,
				played_aral: Number,
				played_blitz: Number,
				plyed_casual: Number,
				played_ranked: Number,
				rankPoints: {
					blitz: Number,
					ranked: Number,
					ranked_5v5: Number
				},
				skillTier: Number,
				winStreak: Number,
				wins: Number,
				xp: Number
			},
			titleId: String
		},
		relationships: {
			assets: {
				data: []
			}
		},
		links: {
			schema: String,
			self: String
		}
	});

// Virtual for player's name
PlayerSchema
.virtual('name')
.get(function () {
	return this.attributes.name;
});

// Virtual for player Id
PlayerSchema
.virtual('playerid')
.get(function () {
	return this.id;
});

// Virtual for player URL
PlayerSchema
.virtual('url')
.get(function () {
	return 'players/' + this.id;
});

// Virtual for matches played
PlayerSchema
.virtual('played')
.get(function () {
	var aral=this.attributes.stats.gamesPlayed.aral;
	var blitz=this.attributes.stats.gamesPlayed.blitz;
	var casual=this.attributes.stats.gamesPlayed.casual;
	var casual5v5=this.attributes.stats.gamesPlayed.casual_5v5;
	var ranked=this.attributes.stats.gamesPlayed.ranked;
	var ranked5v5=this.attributes.stats.gamesPlayed.ranked_5v5;
	var total = aral+blitz+casual+casual5v5+ranked+ranked5v5;
	return total;
});

PlayerSchema
.virtual('winrate')
.get(function () {
	var winRate = this.attributes.stats.wins/this.played;
	var percent = winRate * 100;
	return percent.toFixed(2);
}); 

// Virtual for skill tier
PlayerSchema.virtual('tier')
.get(function() {
	return this.attributes.stats.skillTier;
});

PlayerSchema.set('toObject', { virtuals: true});
PlayerSchema.set('toJSON', { virtuals: true});

//Export model
module.exports = mongoose.model('players', PlayerSchema, 'players');
