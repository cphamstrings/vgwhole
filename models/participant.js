var mongoose = require('mongoose');
var Hero = require('../models/heroes');

var Schema = mongoose.Schema;

var ParticipantSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		type: {type: String},
		id: String,
		attributes: {
			actor: String,
			shardId: String,
			stats: {
				assists: Number,
				crystalMineCaptures: Number,
				deaths: Number,
				farm: Number,
				firstAfkTime: Number,
				gold: Number,
				goldMineCaptures: Number,
				itemGrants: {
					type: Map,
					of: String
				},
				itemSells: {
					type: Map,
					of: String
				},
				items: [String],
				jungleKills: Number,
				karmaLevel: Number,
				kills: Number,
				krakenCaptures: Number,
				level: Number,
				minionKills: Number,
				nonJungleMinionKills: Number,
				skillTier: Number,
				skinKey: String,
				turretCaptures: Number,
				wentAfk: Boolean,
				winner: Boolean
				
			}
		},
		relationships: {
			player: {
				data: {
					type: {type: String},
					id: String
				}
			}
		}
	},
		
);

// Virtual for participant id
ParticipantSchema
.virtual('participantid')
.get(function () {
	return this.id;
});

// Virtual for roster
ParticipantSchema
.virtual('roster', {
	ref: 'rosters',
	localField: 'id',
	foreignField: 'relationships.participants.data.id'
});


// Virtual for Hero name
ParticipantSchema
.virtual('hero', {
	ref: 'heroes',
	localField: 'attributes.actor',
	foreignField: 'name'
});


// Virtual for items
ParticipantSchema
.virtual('items')
.get(function () {
	return this.attributes.stats.get('items');
});

// Virtual for player
ParticipantSchema.virtual('player', {
	ref: 'players',
	localField: 'relationships.player.data.id',
	foreignField: 'id'
});

// Virtual for playerId
ParticipantSchema
.virtual('playerid')
.get(function () {
	return this.relationships.player.data.id;
});

ParticipantSchema.set('toObject', { virtuals: true });
ParticipantSchema.set('toJSON', {virtuals: true });

// Export model
module.exports = mongoose.model('participants', ParticipantSchema, 'participants');
