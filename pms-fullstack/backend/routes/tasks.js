// backend/routes/tasks.js
const express = require('express');
const router  = express.Router();
const Task    = require('../models/Task');

// GET all tasks
router.get('/', async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const { name, project, assigned, priority, deadline } = req.body;
    if (!name || !project || !assigned || !deadline) {
      return res.status(400).json({ success: false, message: 'name, project, assigned, and deadline are required' });
    }
    const task = await Task.create({ name, project, assigned, priority, deadline });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update task (e.g. status change)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
