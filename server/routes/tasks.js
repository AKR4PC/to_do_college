const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/auth');

// IMPORTANT: reorder/bulk must be defined BEFORE /:id
// otherwise Express matches "reorder" as an :id param

// GET all tasks for user
router.get('/', protect, async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.columnId) filter.columnId = req.query.columnId;
    if (req.query.priority)  filter.priority = req.query.priority;
    if (req.query.search) {
      filter.$or = [
        { title:       { $regex: req.query.search, $options: 'i' } },
        { projectName: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const tasks = await Task.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create task
router.post('/', protect, async (req, res) => {
  try {
    const count = await Task.countDocuments({ userId: req.user._id, columnId: req.body.columnId });
    const task = await Task.create({ ...req.body, userId: req.user._id, order: count });
    res.status(201).json(task);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH bulk reorder — MUST be before /:id
router.patch('/reorder/bulk', protect, async (req, res) => {
  try {
    await Promise.all(
      req.body.map(({ _id, columnId, order }) =>
        Task.findOneAndUpdate({ _id, userId: req.user._id }, { columnId, order })
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH update single task
router.patch('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE task
router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
