var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
	{
		name: String,
		category: String,
		tier: Number,
		price: Number,
		attributes: [String],
		details: [
			{
				_id: false,
				label: String,
				value: String
			}
		],
		buildInto: [{ type: Schema.Types.ObjectId, ref: 'items' }],
		buildFrom: [{ type: Schema.Types.ObjectId, ref: 'items' }],
		notes: String,
		image: String

	});


ItemSchema.set('toObject', { virtuals: true });
ItemSchema.set('toJSON', { virtuals: true});

module.exports = mongoose.model('items', ItemSchema);
