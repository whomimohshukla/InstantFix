const mongoose = require("mongoose");
const technicianSchema = new mongoose.Schema(
	{
		// Basic Information (References User model)
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},

		// Professional Information
		employeeId: { type: String, required: true, unique: true },
		joiningDate: { type: Date, required: true },
		employmentType: {
			type: String,
			enum: ["full_time", "part_time", "contract", "freelance"],
			default: "full_time",
		},

		// Skills and Expertise
		expertise: [
			{
				category: { type: String, required: true }, // 'ac_cleaning'
				subCategory: [{ type: String }], // ['split_ac', 'window_ac']
				experience: { type: Number, required: true }, // years
				certifications: [
					{
						name: { type: String },
						issuedBy: { type: String },
						issueDate: { type: Date },
						expiryDate: { type: Date },
						certificateUrl: { type: String },
					},
				],
				skillLevel: {
					type: String,
					enum: ["beginner", "intermediate", "advanced", "expert"],
					default: "intermediate",
				},
			},
		],

		// Performance Metrics
		performance: {
			rating: { type: Number, default: 0, min: 0, max: 5 },
			totalJobs: { type: Number, default: 0 },
			completedJobs: { type: Number, default: 0 },
			cancelledJobs: { type: Number, default: 0 },
			averageJobTime: { type: Number, default: 0 }, // in minutes
			onTimePercentage: { type: Number, default: 0 },
			customerSatisfactionScore: { type: Number, default: 0 },
			qualityScore: { type: Number, default: 0 },
			monthlyStats: [
				{
					month: { type: String }, // 'YYYY-MM'
					jobsCompleted: { type: Number, default: 0 },
					earnings: { type: Number, default: 0 },
					rating: { type: Number, default: 0 },
				},
			],
		},

		// Current Status and Availability
		currentStatus: {
			status: {
				type: String,
				enum: ["available", "busy", "offline", "break", "emergency"],
				default: "offline",
			},
			lastStatusUpdate: { type: Date, default: Date.now },
			currentLocation: {
				latitude: { type: Number },
				longitude: { type: Number },
				address: { type: String },
				lastUpdated: { type: Date },
			},
			currentJob: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Booking",
				default: null,
			},
		},

		// Schedule and Availability
		workingHours: {
			monday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			tuesday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			wednesday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			thursday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			friday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			saturday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: true },
			},
			sunday: {
				start: String,
				end: String,
				isWorking: { type: Boolean, default: false },
			},
		},

		// Service Areas
		serviceAreas: [
			{
				city: { type: String, required: true },
				areas: [{ type: String }],
				pincodes: [{ type: String }],
				travelTime: { type: Number }, // average travel time in minutes
				isPreferred: { type: Boolean, default: false },
			},
		],

		// Documents and Verification
		documents: {
			idProof: {
				type: {
					type: String,
					enum: ["aadhaar", "pan", "passport", "voter_id"],
				},
				number: { type: String },
				documentUrl: { type: String },
				isVerified: { type: Boolean, default: false },
			},
			addressProof: {
				type: { type: String },
				documentUrl: { type: String },
				isVerified: { type: Boolean, default: false },
			},
			experienceCertificate: [
				{
					company: { type: String },
					position: { type: String },
					duration: { type: String },
					certificateUrl: { type: String },
				},
			],
			policeClearance: {
				certificateUrl: { type: String },
				issueDate: { type: Date },
				isVerified: { type: Boolean, default: false },
			},
		},

		// Equipment and Tools
		equipment: [
			{
				name: { type: String, required: true },
				model: { type: String },
				serialNumber: { type: String },
				purchaseDate: { type: Date },
				condition: {
					type: String,
					enum: ["excellent", "good", "fair", "needs_replacement"],
				},
				lastMaintenance: { type: Date },
				isPersonal: { type: Boolean, default: true }, // true if technician owns, false if company provided
			},
		],

		// Financial Information
		financial: {
			bankAccount: {
				accountNumber: { type: String },
				ifscCode: { type: String },
				bankName: { type: String },
				accountHolderName: { type: String },
			},
			salaryDetails: {
				baseSalary: { type: Number },
				incentiveStructure: [
					{
						metric: { type: String }, // 'rating', 'jobs_completed'
						threshold: { type: Number },
						reward: { type: Number },
					},
				],
			},
			earnings: [
				{
					month: { type: String }, // 'YYYY-MM'
					baseSalary: { type: Number },
					incentives: { type: Number },
					deductions: { type: Number },
					totalEarnings: { type: Number },
				},
			],
		},

		// Emergency Information
		emergencyContact: {
			name: { type: String },
			relation: { type: String },
			phone: { type: String },
			address: { type: String },
		},

		// Training and Development
		training: [
			{
				program: { type: String },
				date: { type: Date },
				duration: { type: Number }, // in hours
				score: { type: Number },
				certificateUrl: { type: String },
				instructor: { type: String },
			},
		],

		// Account Status
		isActive: { type: Boolean, default: true },
		isVerified: { type: Boolean, default: false },
		suspensionHistory: [
			{
				reason: { type: String },
				suspendedDate: { type: Date },
				reactivatedDate: { type: Date },
				suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);

// Indexes for performance
technicianSchema.index({ userId: 1 });
technicianSchema.index({ currentLocation: "2dsphere" });
technicianSchema.index({ "currentStatus.status": 1, isActive: 1 });
technicianSchema.index({ "expertise.category": 1 });

module.exports = mongoose.model("Technician", technicianSchema);





