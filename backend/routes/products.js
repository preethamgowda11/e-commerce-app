const router  = require('express').Router();
const Product = require('../models/Products'); // Fixed: was 'Product', file is 'Products.js'
const auth    = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Product.find()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try { res.json(await Product.findById(req.params.id)); }
  catch (e) { res.status(404).json({ message: 'Product not found' }); }
});

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
