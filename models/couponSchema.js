const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
	{
		// Basic Information
		code: { type: String, unique: true, required: true, uppercase: true },
		name: { type: String, required: true },
		description: { type: String, required: true },

		// Discount Details
		discount: {
			type: { type: String, enum: ["percentage", "fixed"], required: true },
			value: { type: Number, required: true },
			maxDiscount: { type: Number }, // Max discount for percentage type
			minOrderValue: { type: Number, default: 0 },
		},

		// Validity
		validity: {
			startDate: { type: Date, required: true },
			endDate: { type: Date, required: true },
			isActive: { type: Boolean, default: true },
		},

		// Usage Limits
		usageLimit: {
			totalUses: { type: Number, default: 1 }, // Total times coupon can be used
			perUser: { type: Number, default: 1 }, // Times per user
			currentUses: { type: Number, default: 0 },
		},

		// Applicable Services
		applicableServices: {
			all: { type: Boolean, default: true },
			serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
			categories: [{ type: String }],
			excludeServices: [
				{ type: mongoose.Schema.Types.ObjectId, ref: "Service" },
			],
		},

		// User Targeting
		userTargeting: {
			all: { type: Boolean, default: true },
			newUsers: { type: Boolean, default: false },
			specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			membershipTiers: [
				{ type: String, enum: ["bronze", "silver", "gold", "platinum"] },
			],
			excludeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		},

		// Geographic Restrictions
		locations: {
			all: { type: Boolean, default: true },
			cities: [{ type: String }],
			pincodes: [{ type: String }],
			excludeCities: [{ type: String }],
		},

		// Usage Tracking
		usageHistory: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
				discountAmount: { type: Number },
				usedAt: { type: Date, default: Date.now },
			},
		],

		// Creator
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Coupon", couponSchema);
