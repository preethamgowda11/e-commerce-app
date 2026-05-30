const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { auth } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: 'Account created successfully' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (password) {
      if (password.length < 6)
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      update.password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;