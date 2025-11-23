const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		// Basic Information
		firstName: { type: String, required: true, trim: true },
		lastName: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		password: { type: String, required: true, minlength: 6 },

		// Role Management
		role: {
			type: String,
			enum: ["customer", "technician", "admin", "manager"],
			default: "customer",
		},

		// Profile Information
		profileImage: { type: String, default: null },
		dateOfBirth: { type: Date },
		gender: { type: String, enum: ["male", "female", "other"] },

		// Address Management (Multiple addresses)
		addresses: [
			{
				_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
				type: {
					type: String,
					enum: ["home", "office", "other"],
					default: "home",
				},
				label: { type: String, required: true }, // "Home", "Office", etc.
				street: { type: String, required: true },
				area: { type: String, required: true },
				landmark: { type: String },
				city: { type: String, required: true },
				state: { type: String, required: true },
				pincode: { type: String, required: true },
				coordinates: {
					latitude: { type: Number, required: true },
					longitude: { type: Number, required: true },
				},
				isDefault: { type: Boolean, default: false },
				instructions: { type: String }, // Special delivery instructions
			},
		],

		// Verification Status
		verification: {
			email: { type: Boolean, default: false },
			phone: { type: Boolean, default: false },
			identity: { type: Boolean, default: false },
			emailVerificationToken: { type: String },
			phoneOTP: { type: String },
			phoneOTPExpiry: { type: Date },
		},

		// Preferences
		preferences: {
			language: { type: String, default: "en" },
			currency: { type: String, default: "INR" },
			timezone: { type: String, default: "Asia/Kolkata" },
			notifications: {
				email: { type: Boolean, default: true },
				sms: { type: Boolean, default: true },
				push: { type: Boolean, default: true },
				whatsapp: { type: Boolean, default: false },
			},
			serviceReminders: { type: Boolean, default: true },
		},

		// Customer-specific fields
		customerData: {
			totalBookings: { type: Number, default: 0 },
			totalSpent: { type: Number, default: 0 },
			loyaltyPoints: { type: Number, default: 0 },
			membershipTier: {
				type: String,
				enum: ["bronze", "silver", "gold", "platinum"],
				default: "bronze",
			},
			referralCode: { type: String, unique: true, sparse: true },
			referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		},

		// Device and Security
		devices: [
			{
				deviceId: { type: String },
				fcmToken: { type: String },
				platform: { type: String, enum: ["ios", "android", "web"] },
				lastActive: { type: Date, default: Date.now },
			},
		],

		// Account Status
		isActive: { type: Boolean, default: true },
		isBlocked: { type: Boolean, default: false },
		lastLogin: { type: Date },

		// Emergency Contact
		emergencyContact: {
			name: { type: String },
			phone: { type: String },
			relation: { type: String },
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Indexes for performance
userSchema.index({ email: 1, phone: 1 });
userSchema.index({ "addresses.coordinates": "2dsphere" });
userSchema.index({ role: 1, isActive: 1 });

// Password hashing middleware
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

