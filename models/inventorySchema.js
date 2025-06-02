const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema({
    // Basic Information
    itemCode: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    // Categorization
    category: {
      main: { type: String, required: true }, // 'spare_parts', 'tools', 'consumables'
      sub: { type: String, required: true },  // 'ac_parts', 'cleaning_supplies'
      type: { type: String, required: true }  // 'filter', 'coil', 'remote'
    },
    
    // Compatibility
    compatibleAppliances: [{
      brand: { type: String, required: true },
      models: [{ type: String }],
      applianceType: { type: String, required: true }
    }],
    
    // Stock Management
    stock: {
      quantity: { type: Number, required: true, default: 0 },
      reserved: { type: Number, default: 0 }, // Reserved for ongoing jobs
      available: { type: Number, default: 0 }, // Available = quantity - reserved
      minimumStock: { type: Number, required: true, default: 10 },
      maximumStock: { type: Number, required: true, default: 100 },
      reorderPoint: { type: Number, required: true, default: 20 }
    },
    
    // Pricing
    pricing: {
      costPrice: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      markup: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' }
    },
    
    // Vendor Information
    vendors: [{
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      vendorName: { type: String },
      costPrice: { type: Number },
      leadTime: { type: Number }, // in days
      isPreferred: { type: Boolean, default: false },
      lastOrderDate: { type: Date }
    }],
    
    // Physical Properties
    specifications: {
      weight: { type: Number }, // in grams
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { type: String, default: 'cm' }
      },
      material: { type: String },
      color: { type: String },
      warranty: { type: Number } // in months
    },
    
    // Location Tracking
    location: {
      warehouse: { type: String, required: true },
      section: { type: String },
      shelf: { type: String },
      bin: { type: String }
    },
    
    // Status
    isActive: { type: Boolean, default: true },
    isDiscontinued: { type: Boolean, default: false },
    
    // Images
    images: [{
      url: { type: String, required: true },
      type: { type: String, enum: ['main', 'detail', 'installation'] }
    }]
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Inventory', inventorySchema);