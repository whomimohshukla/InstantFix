const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		// Basic Information
		bookingId: { type: String, unique: true, required: true }, // Custom booking ID
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		technicianId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Technician",
			index: true,
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Service",
			required: true,
		},

		// Scheduling
		scheduledDateTime: { type: Date, required: true },
		timeSlot: {
			start: { type: String, required: true }, // '09:00'
			end: { type: String, required: true }, // '10:00'
			duration: { type: Number, required: true }, // in minutes
		},

		// Service Location
		serviceAddress: {
			type: {
				type: String,
				enum: ["home", "office", "other"],
				default: "home",
			},
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
			instructions: { type: String }, // Special instructions for technician
			contactPerson: {
				name: { type: String },
				phone: { type: String },
			},
		},

		// Appliance Details
		appliances: [
			{
				category: { type: String, required: true }, // 'AC', 'Refrigerator'
				type: { type: String, required: true }, // 'Split AC', 'Window AC'
				brand: { type: String, required: true },
				model: { type: String },
				capacity: { type: String }, // '1.5 Ton', '200L'
				age: { type: Number }, // in years
				quantity: { type: Number, required: true, default: 1 },
				condition: {
					type: String,
					enum: ["excellent", "good", "fair", "poor"],
				},
				lastServiceDate: { type: Date },
				specificIssues: [{ type: String }], // Customer reported issues
				location: { type: String }, // 'Living Room', 'Bedroom 1'
			},
		],

		// Service Details
		serviceType: {
			type: String,
			enum: ["deep_cleaning", "maintenance", "repair", "installation"],
			required: true,
		},
		addOnServices: [
			{
				serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
				name: { type: String, required: true },
				price: { type: Number, required: true },
				isCompleted: { type: Boolean, default: false },
			},
		],

		// Pricing and Payment
		pricing: {
			baseAmount: { type: Number, required: true },
			addOnAmount: { type: Number, default: 0 },
			discountAmount: { type: Number, default: 0 },
			taxAmount: { type: Number, default: 0 },
			totalAmount: { type: Number, required: true },
			currency: { type: String, default: "INR" },
			discountCoupon: {
				code: { type: String },
				discount: { type: Number },
				type: { type: String, enum: ["percentage", "fixed"] },
			},
		},

		// Status Tracking
		status: {
			type: String,
			enum: [
				"pending", // Just created
				"confirmed", // Payment successful
				"technician_assigned", // Technician assigned
				"technician_dispatched", // Technician on the way
				"technician_arrived", // Technician reached location
				"service_started", // Service in progress
				"service_paused", // Service temporarily paused
				"service_completed", // Service finished
				"quality_check", // Quality verification
				"payment_pending", // Payment collection pending
				"completed", // Fully completed
				"cancelled", // Cancelled by customer/admin
				"refunded", // Refund processed
			],
			default: "pending",
			index: true,
		},

		statusHistory: [
			{
				status: { type: String, required: true },
				timestamp: { type: Date, default: Date.now },
				updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				reason: { type: String },
				location: {
					latitude: { type: Number },
					longitude: { type: Number },
				},
			},
		],

		// Time Tracking
		timeTracking: {
			estimatedDuration: { type: Number, required: true }, // in minutes
			actualStartTime: { type: Date },
			actualEndTime: { type: Date },
			totalDuration: { type: Number }, // actual time taken
			technicianArrivalTime: { type: Date },
			delays: [
				{
					reason: { type: String },
					duration: { type: Number }, // in minutes
					reportedBy: {
						type: String,
						enum: ["customer", "technician", "system"],
					},
				},
			],
		},

		// Quality Assurance
		qualityCheck: {
			beforePhotos: [
				{
					url: { type: String },
					caption: { type: String },
					timestamp: { type: Date },
				},
			],
			afterPhotos: [
				{
					url: { type: String },
					caption: { type: String },
					timestamp: { type: Date },
				},
			],
			videoUrl: { type: String }, // Service video if available
			checklistItems: [
				{
					item: { type: String },
					isCompleted: { type: Boolean, default: false },
					notes: { type: String },
				},
			],
			airQualityBefore: { type: Number }, // If measurable
			airQualityAfter: { type: Number },
			customerSignature: { type: String }, // Digital signature
			technicianNotes: { type: String },
		},

		// Customer Feedback
		feedback: {
			rating: { type: Number, min: 1, max: 5 },
			review: { type: String },
			reviewDate: { type: Date },
			categories: {
				punctuality: { type: Number, min: 1, max: 5 },
				quality: { type: Number, min: 1, max: 5 },
				behavior: { type: Number, min: 1, max: 5 },
				cleanliness: { type: Number, min: 1, max: 5 },
			},
			wouldRecommend: { type: Boolean },
			suggestions: { type: String },
		},

		// Communication
		communications: [
			{
				type: {
					type: String,
					enum: ["call", "sms", "push", "email", "whatsapp"],
				},
				direction: { type: String, enum: ["inbound", "outbound"] },
				content: { type: String },
				timestamp: { type: Date, default: Date.now },
				sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				isRead: { type: Boolean, default: false },
			},
		],

		// Special Requirements
		specialRequirements: {
			hasPets: { type: Boolean, default: false },
			petDetails: { type: String },
			hasAllergies: { type: Boolean, default: false },
			allergyDetails: { type: String },
			accessRestrictions: { type: String },
			preferredLanguage: { type: String, default: "en" },
			emergencyContact: {
				name: { type: String },
				phone: { type: String },
			},
		},

		// Cancellation and Refund
		cancellation: {
			isCancelled: { type: Boolean, default: false },
			cancelledBy: {
				type: String,
				enum: ["customer", "technician", "admin"],
			},
			cancelledDate: { type: Date },
			reason: { type: String },
			refundAmount: { type: Number, default: 0 },
			refundStatus: {
				type: String,
				enum: ["pending", "processed", "failed"],
				default: "pending",
			},
			cancellationFee: { type: Number, default: 0 },
		},

		// Follow-up
		followUp: {
			isRequired: { type: Boolean, default: false },
			scheduledDate: { type: Date },
			reason: { type: String },
			isCompleted: { type: Boolean, default: false },
			notes: { type: String },
		},

		// Analytics
		source: { type: String, enum: ["app", "website", "call", "referral"] },
		deviceInfo: {
			platform: { type: String },
			appVersion: { type: String },
			deviceModel: { type: String },
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

// Indexes for performance
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ technicianId: 1, scheduledDateTime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ "serviceAddress.coordinates": "2dsphere" });

// Virtual for booking duration
bookingSchema.virtual("actualDuration").get(function () {
	if (this.timeTracking.actualStartTime && this.timeTracking.actualEndTime) {
		return Math.floor(
			(this.timeTracking.actualEndTime - this.timeTracking.actualStartTime) /
				(1000 * 60)
		);
	}
	return null;
});

module.exports = mongoose.model("Booking", bookingSchema);