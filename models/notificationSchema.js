const mongoose=require("mongoose");

const notificationSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'booking_confirmed', 'technician_assigned', 'technician_dispatched',
      'service_started', 'service_completed', 'payment_reminder',
      'feedback_request', 'offer', 'system_alert', 'emergency'
    ],
    required: true 
  },
  
  // Recipients
  recipients: {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    roles: [{ type: String, enum: ['customer', 'technician', 'admin', 'manager'] }],
    broadcast: { type: Boolean, default: false } // Send to all users
  },
  
  // Content
  content: {
    shortText: { type: String, maxlength: 100 },
    longText: { type: String },
    imageUrl: { type: String },
    actionUrl: { type: String }, // Deep link or web URL
    actionText: { type: String } // Button text
  },
  
  // Related Data
  relatedEntity: {
    type: { type: String, enum: ['booking', 'payment', 'user', 'service'] },
    id: { type: mongoose.Schema.Types.ObjectId }
  },
  
  // Delivery Channels
  channels: {
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  },
  
  // Scheduling
  scheduling: {
    sendAt: { type: Date, default: Date.now },
    timezone: { type: String, default: 'Asia/Kolkata' },
    isScheduled: { type: Boolean, default: false }
  },
  
  // Status Tracking
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'sent', 'delivered', 'failed'], 
    default: 'draft' 
  },
  
  // Delivery Stats
  stats: {
    totalRecipients: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  
  // Individual Delivery Status
  deliveryStatus: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['push', 'sms', 'email', 'whatsapp'] },
    status: { type: String, enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'failed'] },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    openedAt: { type: Date },
    clickedAt: { type: Date },
    failureReason: { type: String }
  }],
  
  // Creator
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});


module.exports = mongoose.model('Notification', notificationSchema);