var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HeroSchema = new Schema(
	{
		name: {type: String, required: true},
		role: {type: String},
		attributes: {
			health: String,
			healthRegen: String,
			energy: String,
			energyRegen: String,
			weaponDamage: String,
			attackSpeed: String,
			armor: String,
			shield: String,
			attackRange: String,
			moveSpeed: String
		},
		abilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'abilities' }],
		stats: {
			type: Map,
			of: String
		},
		img: String
	}
);

// Virtual for hero Id
HeroSchema
.virtual('heroid')
.get(function() {
	return this._id;
});

// Virtual for hero URL
HeroSchema
.virtual('url')
.get(function() {
	var lowername = this.modifiedName;
	return '/heroes/' + lowername.toLowerCase();
});

// Virtual for hero name
HeroSchema
.virtual('modifiedName')
.get(function() {
	var modified = this.name;
	return modified.replace(/\*/g, '');
});

HeroSchema.set('toObject', { virtuals: true });
HeroSchema.set('toJSON', { virtuals: true});
//Export model
module.exports = mongoose.model('heroes', HeroSchema);
