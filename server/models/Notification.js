const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:    { type: String, required: true },
    taskId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    type:    { type: String, enum: ['reminder', 'info', 'warning'], default: 'info' },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
