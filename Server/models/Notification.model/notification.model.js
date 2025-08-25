const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String },
    type: { type: String, required: true }, // e.g. ARRIVAL_NOTICE, BOOKED, CANCELLED
    read: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // flexible payload
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
