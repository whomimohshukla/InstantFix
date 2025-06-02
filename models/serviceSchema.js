const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
    // Basic Information
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true, maxlength: 150 },
  
  // Categorization
  category: {
    main: { type: String, required: true }, // 'appliance_cleaning'
    sub: { type: String, required: true },  // 'ac_cleaning', 'refrigerator_cleaning'
    type: { type: String, required: true }  // 'deep_clean', 'maintenance', 'repair'
  },
  
  // Pricing Structure
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    pricingType: { 
      type: String, 
      enum: ['fixed', 'per_unit', 'per_hour', 'dynamic'], 
      default: 'fixed' 
    },
    discountPrice: { type: Number, default: 0 },
    membershipDiscount: {
      bronze: { type: Number, default: 0 },
      silver: { type: Number, default: 5 },
      gold: { type: Number, default: 10 },
      platinum: { type: Number, default: 15 }
    }
  },
  
  // Time Management
  timeEstimates: {
    minimum: { type: Number, required: true }, // in minutes
    maximum: { type: Number, required: true },
    average: { type: Number, required: true },
    bufferTime: { type: Number, default: 10 } // extra time buffer
  },
  
  // Service Details
  serviceIncludes: [{ type: String }], // What's included
  serviceExcludes: [{ type: String }], // What's not included
  requirements: [{ type: String }],     // Customer requirements
  preparation: [{ type: String }],      // What customer should prepare
  
  // Media
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    type: { type: String, enum: ['thumbnail', 'gallery', 'before_after'] }
  }],
  videos: [{
    url: { type: String },
    title: { type: String },
    duration: { type: Number } // in seconds
  }],
  
  // Appliance Types Supported
  applianceTypes: [{
    name: { type: String, required: true }, // 'Split AC', 'Window AC'
    brands: [{ type: String }], // ['LG', 'Samsung', 'Voltas']
    models: [{ type: String }], // Specific models if needed
    additionalPrice: { type: Number, default: 0 },
    estimatedTime: { type: Number } // time for this specific type
  }],
  
  // Availability
  availability: {
    isActive: { type: Boolean, default: true },
    seasonal: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date }
    },
    timeSlots: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      slots: [{
        startTime: { type: String }, // '09:00'
        endTime: { type: String },   // '10:00'
        isAvailable: { type: Boolean, default: true }
      }]
    }]
  },
  
  // Service Areas
  serviceAreas: [{
    city: { type: String, required: true },
    areas: [{ type: String }], // Specific areas within city
    pincodes: [{ type: String }],
    isActive: { type: Boolean, default: true }
  }],
  
  // Quality Standards
  qualityStandards: [{
    parameter: { type: String }, // 'Dust Removal', 'Filter Cleaning'
    standard: { type: String },  // Description of standard
    measurable: { type: Boolean, default: false },
    unit: { type: String } // 'percentage', 'minutes', etc.
  }],
  
  // Add-on Services
  addOns: [{
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    estimatedTime: { type: Number },
    isRecommended: { type: Boolean, default: false }
  }],
  
  // SEO and Marketing
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },
  
  // Analytics
  analytics: {
    totalBookings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
serviceSchema.index({ 'category.main': 1, 'category.sub': 1 });
serviceSchema.index({ 'availability.isActive': 1 });
serviceSchema.index({ slug: 1 });


module.exports = mongoose.model('Service', serviceSchema);