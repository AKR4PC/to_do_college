const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    color:   { type: String, default: '#4f8ef7' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
