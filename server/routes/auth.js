const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = new User({ name, email, password });
    await user.save();
    const token = sign(user._id);
    return res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, teamName: user.teamName },
    });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = sign(user._id);
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, teamName: user.teamName },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, teamName: req.user.teamName });
});

router.patch('/settings', protect, async (req, res) => {
  try {
    const { name, teamName, password, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (teamName) user.teamName = teamName;
    if (password && newPassword) {
      if (!(await user.matchPassword(password)))
        return res.status(400).json({ message: 'Current password incorrect' });
      user.password = newPassword;
    }
    await user.save();
    return res.json({ _id: user._id, name: user.name, email: user.email, teamName: user.teamName });
  } catch (err) {
    console.error('SETTINGS ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
