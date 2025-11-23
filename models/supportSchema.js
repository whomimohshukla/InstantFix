const mongoose=require("mongoose");

const supportTicketSchema = new mongoose.Schema(
	{
		// Basic Information
		ticketId: { type: String, unique: true, required: true },
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		relatedBookingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking",
		},

		// Issue Details
		subject: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: String,
			enum: [
				"booking_issue",
				"payment_issue",
				"service_quality",
				"technician_behavior",
				"refund_request",
				"general_inquiry",
				"technical_support",
				"complaint",
				"suggestion",
			],
			required: true,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},

		// Status Tracking
		status: {
			type: String,
			enum: [
				"open",
				"in_progress",
				"waiting_customer",
				"resolved",
				"closed",
			],
			default: "open",
		},

		// Assignment
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Support agent
		},
		assignedDate: { type: Date },

		// Communication Thread
		messages: [
			{
				sender: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				senderType: {
					type: String,
					enum: ["customer", "support", "technician", "system"],
					required: true,
				},
				message: { type: String, required: true },
				attachments: [
					{
						url: { type: String },
						filename: { type: String },
						fileSize: { type: Number },
						mimeType: { type: String },
					},
				],
				timestamp: { type: Date, default: Date.now },
				isRead: { type: Boolean, default: false },
			},
		],

		// Resolution
		resolution: {
			resolvedAt: { type: Date },
			resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			resolutionSummary: { type: String },
			customerSatisfaction: { type: Number, min: 1, max: 5 },
			actionTaken: { type: String },
		},

		// SLA Tracking
		sla: {
			responseTime: { type: Number }, // in minutes
			resolutionTime: { type: Number }, // in minutes
			targetResponseTime: { type: Number, default: 60 }, // 1 hour
			targetResolutionTime: { type: Number, default: 1440 }, // 24 hours
			isResponseSLABreached: { type: Boolean, default: false },
			isResolutionSLABreached: { type: Boolean, default: false },
		},

		// Tags and Labels
		tags: [{ type: String }],
		internalNotes: { type: String }, // Internal notes for support team
	},
	{
		timestamps: true,
	}
);

// Indexes
supportTicketSchema.index({ customerId: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ category: 1, priority: 1 });


module.exports = mongoose.model("SupportTicket", supportTicketSchema);