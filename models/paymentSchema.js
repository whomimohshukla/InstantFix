const mongoose=require("mongoose");

const paymentSchema = new mongoose.Schema({

    // Basic Information
    paymentId: { type: String, unique: true, required: true },
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Booking', 
      required: true,
      index: true 
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    
    // Payment Details
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { 
      type: String, 
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash', 'cod'], 
      required: true 
    },
    
    // Payment Gateway Details
    gateway: {
      provider: { type: String, enum: ['razorpay', 'payu', 'ccavenue', 'stripe'] },
      transactionId: { type: String, unique: true, sparse: true },
      gatewayOrderId: { type: String },
      gatewayPaymentId: { type: String },
      signature: { type: String } // For payment verification
    },
    
    // Status
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'], 
      default: 'pending',
      index: true 
    },
    
    // Timestamps
    initiatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    failedAt: { type: Date },
    
    // Payment Breakdown
    breakdown: {
      serviceAmount: { type: Number, required: true },
      addOnAmount: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      convenienceFee: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true }
    },
    
    // Refund Information
    refund: {
      isRefunded: { type: Boolean, default: false },
      refundAmount: { type: Number, default: 0 },
      refundReason: { type: String },
      refundInitiatedAt: { type: Date },
      refundCompletedAt: { type: Date },
      refundTransactionId: { type: String },
      refundStatus: { 
        type: String, 
        enum: ['pending', 'processing', 'success', 'failed'] 
      }
    })