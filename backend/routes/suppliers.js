const express = require('express');
const Supplier = require('../models/Supplier');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }
    const supplier = await Supplier.create({
      name,
      email: req.body.email || '',
      phone: req.body.phone || '',
      address: req.body.address || ''
    });
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Supplier.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;