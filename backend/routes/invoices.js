const express = require('express');
const Invoice = require('../models/Invoice');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { invoice_no, customer_name } = req.body;
    if (!invoice_no || !customer_name) {
      return res.status(400).json({ error: 'Invoice number and customer name are required' });
    }

    const items = Array.isArray(req.body.items)
      ? req.body.items.map(line => ({
          itemId: line.itemId || '',
          name: line.name || '',
          quantity: Number(line.quantity) || 0,
          unit_price: Number(line.unitPrice !== undefined ? line.unitPrice : 0) || 0
        }))
      : [];

    const invoice = await Invoice.create({
      invoice_no,
      customer_name,
      invoice_date: req.body.invoice_date || new Date().toISOString().slice(0, 10),
      items,
      total: Number(req.body.total) || 0,
      status: req.body.status || 'Pending',
      gst_rate: Number(req.body.gst_rate) || 0,
      supplier_name: req.body.supplier_name || '',
      supplier_address: req.body.supplier_address || '',
      supplier_phone: req.body.supplier_phone || ''
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
});

module.exports = router;