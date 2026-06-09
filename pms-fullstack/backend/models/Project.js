// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    lead:     { type: String, required: true, trim: true },
    status:   { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    deadline: { type: String, required: true },
    desc:     { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
