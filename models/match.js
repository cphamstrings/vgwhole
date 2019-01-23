var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MatchSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		type: {type: String},
		id: String,
		attributes: {
			createdAt: String,
			duration: Number,
			gameMode: String,
			patchVersion: String,
			shardId: String,
			stats: {
				type: Map,
				of: String
			},
			tags: String,
			titleId: String
		},
		relationships: {
			assets: {
				data: [
					{
						type: {type: String},
						id: String
					}
				]
			},
			rosters: {
				data: [
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
			rounds: {
				data: []
			},
			spectators: {
				data: []
			}
		},
		links: {
			schema: String,
			self: String
		}

	},{
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

// Virtual for match Id
MatchSchema
.virtual('matchid')
.get(function () {
	return this.id;
});

// Virtual for match URL
MatchSchema
.virtual('url')
.get(function () {
	return '/matches/' + this.id
});

// Virtual for date
MatchSchema
.virtual('date')
.get(function () {
	return this.attributes.createdAt;
});

// Virtual for duration
MatchSchema
.virtual('duration')
.get(function () {
	var time = this.attributes.duration;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	function str_pad_left(string, pad, length) {
		return (new Array(length+1).join(pad)+string).slice(-length);
	}
	var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds, '0',2);

	return finalTime;
});

// Virtual for gameMode
MatchSchema
.virtual('gameMode')
.get(function () {
	return this.attributes.gameMode;
});

// Virtual for shardId
MatchSchema
.virtual('shardId')
.get(function () {
	return this.attributes.shardId;
});

// Virtual for rosters
MatchSchema.virtual('rosters', {
	ref: 'rosters',
	localField: 'relationships.rosters.data.id',
	foreignField: 'id'
});

// Virtual for roster0
MatchSchema
.virtual('roster0')
.get(function () {
	return this.relationships.rosters.data[0].id;
});

// Virtual for roster1
MatchSchema
.virtual('roster1')
.get(function () {
	return this.relationships.rosters.data[1].id;
});

MatchSchema.set('toObject', { virtuals: true });
MatchSchema.set('toJSON', { virtuals: true });

//Export model
module.exports = mongoose.model('matches', MatchSchema, 'matches');
