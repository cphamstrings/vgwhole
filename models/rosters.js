var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RosterSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		type: {type: String},
		id: String,
		attributes: {
			shardId: String,
			stats: {
				type: Map,
				of: String
			},
			won: String
		},
		relationships: {
			participants: {
				data: [
					{
						type: {type: String},
						id: String
					},
					{
						type: {type: String},
						id: String
					},
					{
						type: {type: String},
						id: String
					},
					{
						type: {type: String},
						id: String
					},
					{
						type: {type: String},
						id: String
					}
				]
			},
			team: {
				data: String
			}
		}
	}
);

// Virtual for roster id
RosterSchema
.virtual('rosterid')
.get(function () {
	return this._id;
});

// Virtual for winorlose
RosterSchema
.virtual('win')
.get(function() {
	return this.attributes.won;
});

// Virtual for matchId
RosterSchema.virtual('matchId', {
	ref: 'matches',
	localField: 'id',
	foreignField: 'id'
});

// Test virtual for participants
RosterSchema.virtual('participant', {
	ref: 'participants',
	localField: 'relationships.participants.data.id',
	foreignField: 'id'
});

// Virtual for side
RosterSchema.virtual('sides')
.get(function() {
	console.log(this.attributes.stats.side);
	return this.attributes.stats.get('side');
});


RosterSchema.set('toObject', { virtuals: true });
RosterSchema.set('toJSON', { virtuals: true });

// Export model

module.exports = mongoose.model('rosters', RosterSchema, 'rosters');
