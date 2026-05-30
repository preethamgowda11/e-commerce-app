const router  = require('express').Router();
const Product = require('../models/Products');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    res.json(await Product.find(query).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(404).json({ message: 'Product not found' }); }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price == null || stock == null)
      return res.status(400).json({ message: 'Name, price and stock are required' });
    res.status(201).json(await Product.create(req.body));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;