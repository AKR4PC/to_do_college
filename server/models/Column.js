const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // 'todo' | 'inprogress' | 'done'
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Column', columnSchema);
