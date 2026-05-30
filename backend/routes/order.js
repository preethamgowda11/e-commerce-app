const router = require('express').Router();
const Order  = require('../models/Order');
const auth   = require('../middleware/auth');

// Get my orders
router.get('/my', auth, async (req, res) => {
  try { res.json(await Order.find({ user: req.user.id }).populate('items.product', 'name image')); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all orders (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    res.json(await Order.find().populate('user', 'name email').populate('items.product', 'name'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Update order status (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    res.json(await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
