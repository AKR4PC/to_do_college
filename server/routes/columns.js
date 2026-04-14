const express = require('express');
const router = express.Router();
const Column = require('../models/Column');

// GET all columns (seed defaults if empty)
router.get('/', async (req, res) => {
  try {
    let columns = await Column.find().sort({ order: 1 });
    if (columns.length === 0) {
      const defaults = [
        { id: 'todo', title: 'To do', order: 0 },
        { id: 'inprogress', title: 'In progress', order: 1 },
        { id: 'done', title: 'Done', order: 2 },
      ];
      columns = await Column.insertMany(defaults);
    }
    res.json(columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
