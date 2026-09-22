require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Item = require('./models/Item');
const User = require('./models/User');
const itemsRouter = require('./routes/items');
const suppliersRouter = require('./routes/suppliers');
const invoicesRouter = require('./routes/invoices');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? true : allowedOrigins,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'Billing Software API', status: 'ok', time: new Date().toISOString() });
});

app.use('/api/items', itemsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function seed() {
  const adminExists = await User.exists({ email: 'admin@admin.in' });
  if (!adminExists) {
    await User.create([
      { name: 'Admin User', email: 'admin@admin.in', password: 'admin123', role: 'admin' },
      { name: 'Billing User', email: 'user@admin.in', password: 'user123', role: 'user' }
    ]);
    console.log('Seeded demo user accounts (admin@admin.in / admin123, user@admin.in / user123)');
  }

  const itemCount = await Item.countDocuments();
  if (itemCount === 0) {
    await Item.insertMany([
      { name: 'Wireless Headphones', sku: 'WH-2401', category: 'Electronics', price: 2499, stock: 24 },
      { name: 'USB-C Cable', sku: 'UC-1102', category: 'Accessories', price: 499, stock: 67 },
      { name: 'Desk Lamp', sku: 'DL-3320', category: 'Office', price: 1699, stock: 14 }
    ]);
    console.log('Seeded starter inventory items');
  }
}

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env and add your MongoDB Atlas connection string.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Atlas');

  await seed();

  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distDir, 'index.html'));
    });
    console.log('Serving built frontend from ../dist');
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Billing API running on port ${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});