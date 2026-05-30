const router  = require('express').Router();
const Order   = require('../models/Order');
const Product = require('../models/Products');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      total += product.price * item.quantity;
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ user: req.user.id, items, total, address });
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;