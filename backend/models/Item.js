const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, default: null },
    category: { type: String, default: 'General' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

itemSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Item', itemSchema);