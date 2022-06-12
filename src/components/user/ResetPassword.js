

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ResetPasswordSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		token: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			expires: 3600,
			default: Date.now()
		}
	},
	{ timestamps: true }
);

ResetPasswordSchema.pre('save', async function(next) {
	if (this.isModified('token')) {
		const hash = await bcrypt.hash(this.token, 8);
		this.token = hash;
	}
	next();
});

ResetPasswordSchema.methods.compareToken = async function(token) {
	const result = await bcrypt.compareSync(token, this.token);
	return result;
};

const ResetToken = mongoose.model('ResetToken', ResetPasswordSchema);

module.exports = ResetToken;     
