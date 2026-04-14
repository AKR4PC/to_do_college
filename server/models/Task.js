const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    projectName: { type: String, default: '' }, // denormalized for quick display
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    columnId:    { type: String, required: true, enum: ['todo', 'inprogress', 'done'] },
    order:       { type: Number, default: 0 },
    priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    progress:    { type: Number, default: 0, min: 0, max: 100 },
    dueDate:     { type: String, default: '' },  // display string e.g. "24 Aug 2022"
    dueDateISO:  { type: Date, default: null },  // actual Date for reminder logic
    comments:    { type: Number, default: 0 },
    attachments: { type: Number, default: 0 },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
