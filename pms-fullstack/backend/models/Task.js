// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    project:  { type: String, required: true, trim: true },
    assigned: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    deadline: { type: String, required: true },
    status:   { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
