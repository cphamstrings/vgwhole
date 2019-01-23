var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AbilitySchema = new Schema(
	{
		name: String,
		hero: { type: Schema.Types.ObjectId, ref: 'heroes' },
		slot: String,
		description: String,
		altdescription: {
			effect: String,
			info: String
		},
		notes: [String],
		details: {
			stats: [
				{
				_id: false,
				label: String,
				value: String
				}
			],
			cooldown: String,
			manacost: String
		},
		image: String

	}
);

AbilitySchema.set('toObject', { virtuals: true });
AbilitySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('abilities', AbilitySchema);
