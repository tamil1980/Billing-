const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({ error: 'Item name and price are required' });
    }
    const item = await Item.create({
      name,
      sku: req.body.sku || null,
      category: req.body.category || 'General',
      price: Number(price),
      stock: Number(req.body.stock) || 0
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Item.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;