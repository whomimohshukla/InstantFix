const mongoose = require("mongoose");
const analyticsSchema = new mongoose.Schema(
	{
		// Time Period
		period: {
			type: {
				type: String,
				enum: ["daily", "weekly", "monthly", "yearly"],
				required: true,
			},
			date: { type: Date, required: true }, // Start date of the period
			year: { type: Number, required: true },
			month: { type: Number }, // 1-12
			week: { type: Number }, // 1-52
			day: { type: Number }, // 1-31
		},

		// Business Metrics
		business: {
			totalBookings: { type: Number, default: 0 },
			completedBookings: { type: Number, default: 0 },
			cancelledBookings: { type: Number, default: 0 },
			totalRevenue: { type: Number, default: 0 },
			averageOrderValue: { type: Number, default: 0 },
			newCustomers: { type: Number, default: 0 },
			returningCustomers: { type: Number, default: 0 },
		},

		// Service Performance
		services: [
			{
				serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
				serviceName: { type: String },
				bookings: { type: Number, default: 0 },
				revenue: { type: Number, default: 0 },
				averageRating: { type: Number, default: 0 },
				completionRate: { type: Number, default: 0 },
			},
		],

		// Technician Performance
		technicians: [
			{
				technicianId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Technician",
				},
				totalJobs: { type: Number, default: 0 },
				completedJobs: { type: Number, default: 0 },
				averageRating: { type: Number, default: 0 },
				totalEarnings: { type: Number, default: 0 },
				onTimePercentage: { type: Number, default: 0 },
			},
		],

		// Geographic Data
		geographic: [
			{
				city: { type: String },
				area: { type: String },
				pincode: { type: String },
				bookings: { type: Number, default: 0 },
				revenue: { type: Number, default: 0 },
			},
		],

		// Customer Insights
		customer: {
			totalActiveUsers: { type: Number, default: 0 },
			averageLifetimeValue: { type: Number, default: 0 },
			churnRate: { type: Number, default: 0 },
			retentionRate: { type: Number, default: 0 },
			npsScore: { type: Number, default: 0 }, // Net Promoter Score
		},

		// Operational Metrics
		operations: {
			averageResponseTime: { type: Number, default: 0 }, // in minutes
			averageServiceTime: { type: Number, default: 0 },
			firstCallResolution: { type: Number, default: 0 },
			technicianUtilization: { type: Number, default: 0 },
		},
	},
	{
		timestamps: true,
	}
);

// Compound indexes for efficient querying
analyticsSchema.index({ "period.type": 1, "period.date": -1 });
analyticsSchema.index({ "period.year": 1, "period.month": 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
