const mongoose = require("mongoose");
const trackingSchema = new mongoose.Schema(
	{
		// Basic Information
		bookingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking",
			required: true,
			unique: true,
		},
		technicianId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Technician",
			required: true,
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Real-time Location Updates
		locationUpdates: [
			{
				latitude: { type: Number, required: true },
				longitude: { type: Number, required: true },
				address: { type: String },
				accuracy: { type: Number }, // GPS accuracy in meters
				timestamp: { type: Date, default: Date.now },
				source: {
					type: String,
					enum: ["gps", "network", "manual"],
					default: "gps",
				},
			},
		],

		// Status Updates
		statusUpdates: [
			{
				status: {
					type: String,
					enum: [
						"assigned",
						"dispatched",
						"on_route",
						"nearby",
						"arrived",
						"service_started",
						"service_paused",
						"service_completed",
						"departed",
					],
					required: true,
				},
				timestamp: { type: Date, default: Date.now },
				location: {
					latitude: { type: Number },
					longitude: { type: Number },
				},
				notes: { type: String },
				estimatedArrival: { type: Date }, // ETA for customer
			},
		],

		// Route Information
		route: {
			startLocation: {
				latitude: { type: Number },
				longitude: { type: Number },
				address: { type: String },
			},
			endLocation: {
				latitude: { type: Number },
				longitude: { type: Number },
				address: { type: String },
			},
			distance: { type: Number }, // in kilometers
			estimatedDuration: { type: Number }, // in minutes
			actualDuration: { type: Number },
			waypoints: [
				{
					latitude: { type: Number },
					longitude: { type: Number },
					timestamp: { type: Date },
					purpose: { type: String }, // 'fuel_stop', 'parts_pickup', etc.
				},
			],
		},

		// Communication Log
		communications: [
			{
				type: { type: String, enum: ["call", "message", "automated"] },
				direction: {
					type: String,
					enum: ["customer_to_tech", "tech_to_customer", "system"],
				},
				content: { type: String },
				timestamp: { type: Date, default: Date.now },
				status: {
					type: String,
					enum: ["sent", "delivered", "read", "failed"],
				},
			},
		],

		// Real-time Metrics
		metrics: {
			currentSpeed: { type: Number }, // km/h
			averageSpeed: { type: Number },
			totalDistanceTraveled: { type: Number },
			batteryLevel: { type: Number }, // Technician's device battery
			networkStrength: { type: Number }, // Signal strength
			lastUpdateReceived: { type: Date },
		},

		// Geofencing
		geofences: [
			{
				name: { type: String }, // 'customer_location', 'service_area'
				center: {
					latitude: { type: Number, required: true },
					longitude: { type: Number, required: true },
				},
				radius: { type: Number, required: true }, // in meters
				entryTime: { type: Date },
				exitTime: { type: Date },
				isInside: { type: Boolean, default: false },
			},
		],

		// Sharing Settings
		sharing: {
			isLiveTrackingEnabled: { type: Boolean, default: true },
			shareWithCustomer: { type: Boolean, default: true },
			shareWithFamily: { type: Boolean, default: false }, // Emergency contact
			trackingUrl: { type: String }, // Shareable tracking link
			expiresAt: { type: Date },
		},

		// Completion Status
		isCompleted: { type: Boolean, default: false },
		completedAt: { type: Date },
	},
	{
		timestamps: true,
	}
);

// Geospatial index for location queries
trackingSchema.index({ locationUpdates: "2dsphere" });
trackingSchema.index({ bookingId: 1, "statusUpdates.timestamp": -1 });

module.exports = mongoose.model("Tracking", trackingSchema);
